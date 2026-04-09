import { describe, it, expect, beforeEach, vi } from "vitest";
import { useEmulatorStore } from "../../src/store/useEmulatorStore";
import { RubyCompiler } from "../../src/lib/ruby_wasm";
import * as Emulator from "../../src/core/emulator";

// Mock RubyCompiler
vi.mock("../../src/lib/ruby_wasm", () => ({
  RubyCompiler: {
    init: vi.fn(),
    compileToYarv: vi.fn(),
  },
}));

// Mock Emulator.run
vi.mock("../../src/core/emulator", async (importOriginal) => {
  const actual = await importOriginal<typeof Emulator>();
  return {
    ...actual,
    run: vi.fn(),
  };
});

describe("useEmulatorStore", () => {
  // Reset store state before each test
  beforeEach(() => {
    useEmulatorStore.setState({
      isWasmLoading: false,
      rawIseq: null,
      history: [],
      currentIndex: -1,
    });
    vi.clearAllMocks();
  });

  it("should have initial state", () => {
    const state = useEmulatorStore.getState();
    expect(state.isWasmLoading).toBe(false);
    expect(state.history).toEqual([]);
    expect(state.currentIndex).toBe(-1);
  });

  describe("compile", () => {
    it("should compile code and set history", () => {
      const mockRawYarv = ["YARV", 1, 2];
      const mockHistory = [
        { frames: [{ pc: 0 }] }, // step 0
        { frames: [{ pc: 1 }] }, // step 1
      ] as any;

      vi.mocked(RubyCompiler.compileToYarv).mockReturnValue(mockRawYarv);
      vi.mocked(Emulator.run).mockReturnValue(mockHistory);

      useEmulatorStore.getState().compile("puts 1");

      const state = useEmulatorStore.getState();
      expect(state.rawIseq).toEqual(mockRawYarv);
      expect(state.history).toEqual(mockHistory);
      expect(state.currentIndex).toBe(0);
    });
  });

  describe("navigation", () => {
    beforeEach(() => {
      // Setup mock history for navigation tests
      useEmulatorStore.setState({
        history: [
          { frames: [{ pc: 0 }] },
          { frames: [{ pc: 1 }] },
          { frames: [{ pc: 2 }] },
        ] as any,
        currentIndex: 0,
      });
    });

    it("stepForward should increment currentIndex", () => {
      useEmulatorStore.getState().stepForward();
      expect(useEmulatorStore.getState().currentIndex).toBe(1);

      useEmulatorStore.getState().stepForward();
      expect(useEmulatorStore.getState().currentIndex).toBe(2);

      // Should not exceed the limit
      useEmulatorStore.getState().stepForward();
      expect(useEmulatorStore.getState().currentIndex).toBe(2);
    });

    it("stepBack should decrement currentIndex", () => {
      useEmulatorStore.setState({ currentIndex: 2 });

      useEmulatorStore.getState().stepBack();
      expect(useEmulatorStore.getState().currentIndex).toBe(1);

      useEmulatorStore.getState().stepBack();
      expect(useEmulatorStore.getState().currentIndex).toBe(0);

      // Should not go below 0
      useEmulatorStore.getState().stepBack();
      expect(useEmulatorStore.getState().currentIndex).toBe(0);
    });

    it("goToStep should jump to specific index", () => {
      useEmulatorStore.getState().goToStep(2);
      expect(useEmulatorStore.getState().currentIndex).toBe(2);

      useEmulatorStore.getState().goToStep(0);
      expect(useEmulatorStore.getState().currentIndex).toBe(0);

      // Out of bounds index should be ignored
      useEmulatorStore.getState().goToStep(10);
      expect(useEmulatorStore.getState().currentIndex).toBe(0);
      
      useEmulatorStore.getState().goToStep(-1);
      expect(useEmulatorStore.getState().currentIndex).toBe(0);
    });
  });
});
