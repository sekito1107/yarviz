import { describe, it, expect, beforeEach } from "vitest";
import { useEmulatorStore } from "../../src/store/emulatorStore";
import { useRubyRuntimeStore } from "../../src/store/rubyRuntimeStore";

describe("useEmulatorStore", () => {
  beforeEach(async () => {
    // Ensure WASM is initialized for actual logic testing
    await useRubyRuntimeStore.getState().initTask();

    useEmulatorStore.setState({
      rawIseq: null,
      history: [],
      currentIndex: -1,
    });
  });

  it("should have initial state", () => {
    const state = useEmulatorStore.getState();
    expect(state.rawIseq).toBeNull();
    expect(state.history).toEqual([]);
    expect(state.currentIndex).toBe(-1);
  });

  describe("compile", () => {
    it("should compile Ruby code and generate execution history", () => {
      // Use implemented instructions only (putobject, opt_plus, leave)
      const code = "1 + 2";
      useEmulatorStore.getState().compile(code);

      const state = useEmulatorStore.getState();
      expect(state.rawIseq).toBeDefined();
      expect(state.history.length).toBeGreaterThan(0);
      expect(state.currentIndex).toBe(0);
    });
  });

  describe("navigation", () => {
    beforeEach(() => {
      // Setup actual execution history using implemented instructions
      // This produces enough steps (putobject x3, opt_plus x2, leave)
      useEmulatorStore.getState().compile("1 + 2 + 3");
    });

    it("stepForward should increment currentIndex", () => {
      const initialIndex = useEmulatorStore.getState().currentIndex;
      useEmulatorStore.getState().stepForward();
      expect(useEmulatorStore.getState().currentIndex).toBe(initialIndex + 1);
    });

    it("stepBack should decrement currentIndex", () => {
      useEmulatorStore.getState().stepForward();
      const nextIndex = useEmulatorStore.getState().currentIndex;
      
      useEmulatorStore.getState().stepBack();
      expect(useEmulatorStore.getState().currentIndex).toBe(nextIndex - 1);
    });

    it("goToStep should jump to specific index", () => {
      // Jump to step 2 (should exist in 1+2+3)
      useEmulatorStore.getState().goToStep(2);
      expect(useEmulatorStore.getState().currentIndex).toBe(2);

      useEmulatorStore.getState().goToStep(0);
      expect(useEmulatorStore.getState().currentIndex).toBe(0);
    });
  });

  describe("selectors", () => {
    beforeEach(() => {
      useEmulatorStore.getState().compile("1 + 2");
    });

    it("activeFrame() should return the latest frame of the current step", () => {
      const state = useEmulatorStore.getState();
      const frame = state.activeFrame();
      expect(frame).toBeDefined();
      expect(frame).toHaveProperty("pc");
    });

    it("activeStack() should return the operand stack from the active frame", () => {
      // Navigate to a step with values on stack
      useEmulatorStore.getState().goToStep(1);
      const state = useEmulatorStore.getState();
      const stack = state.activeStack();
      expect(Array.isArray(stack)).toBe(true);
    });
  });
});
