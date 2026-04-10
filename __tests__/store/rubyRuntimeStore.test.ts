import { describe, it, expect, beforeEach } from "vitest";
import { useRubyRuntimeStore } from "../../src/store/rubyRuntimeStore";

describe("rubyRuntimeStore", () => {
  beforeEach(() => {
    useRubyRuntimeStore.setState({
      isWasmLoading: true,
      rubyVersion: null,
    });
  });

  it("should have initial state", () => {
    const state = useRubyRuntimeStore.getState();
    expect(state.isWasmLoading).toBe(true);
    expect(state.rubyVersion).toBeNull();
  });

  it("should initialize WASM and set ruby version", async () => {
    await useRubyRuntimeStore.getState().initTask();

    const state = useRubyRuntimeStore.getState();
    expect(state.isWasmLoading).toBe(false);
    expect(state.rubyVersion).toMatch(/ruby \d+\.\d+\.\d+/);
  });
});
