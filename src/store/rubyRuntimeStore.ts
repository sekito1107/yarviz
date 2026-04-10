import { create } from "zustand";
import { RubyCompiler } from "../lib/ruby_wasm";
import type { RubyRuntimeStore } from "./types";

/**
 * Store for managing the Ruby WASM runtime environment.
 */
export const useRubyRuntimeStore = create<RubyRuntimeStore>((set) => ({
  // --- State ---
  isWasmLoading: true,
  rubyVersion: null,

  // --- Actions ---

  /**
   * Initializes the Ruby WASM environment and fetches the version string.
   */
  async initTask() {
    set({ isWasmLoading: true });
    try {
      await RubyCompiler.init();
      const version = RubyCompiler.getVersion();
      set({ isWasmLoading: false, rubyVersion: version });
    } catch (error) {
      console.error("Failed to initialize Ruby WASM:", error);
    }
  },
}));
