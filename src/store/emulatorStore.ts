import { create } from "zustand";
import { RubyCompiler } from "../lib/ruby_wasm";
import { run } from "../core/emulator";
import type { EmulatorStore } from "./types";

/**
 * Store for managing YARV emulator execution state and history.
 * All operations and data extractions are encapsulated as methods.
 */
export const useEmulatorStore = create<EmulatorStore>((set, get) => ({
  // --- State ---
  rawIseq: null,
  history: [],
  currentIndex: -1,

  /**
   * Returns the currently active frame.
   * Returns null if no history exists or currentIndex is invalid.
   */
  activeFrame() {
    return this.history[this.currentIndex]?.frames?.at(-1) ?? null;
  },

  /**
   * Returns the operand stack of the active frame.
   * Returns null if no active frame exists.
   */
  activeStack() {
    return this.activeFrame()?.stack ?? null;
  },


  // --- Actions ---

  /**
   * Compiles Ruby code into YARV and initializes history.
   */
  compile(code: string) {
    try {
      const rawYarv = RubyCompiler.compileToYarv(code);
      const history = run(rawYarv);

      set({
        rawIseq: rawYarv,
        history: history,
        currentIndex: 0,
      });
    } catch (error) {
      console.error("Compilation failed:", error);
    }
  },

  /**
   * Moves to the next instruction in history.
   */
  stepForward() {
    const { history, currentIndex } = get();
    if (currentIndex < history.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  /**
   * Moves to the previous instruction in history.
   */
  stepBack() {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  /**
   * Jumps to a specific step in history.
   */
  goToStep(index: number) {
    const { history } = get();
    if (index >= 0 && index < history.length) {
      set({ currentIndex: index });
    }
  },
}));
