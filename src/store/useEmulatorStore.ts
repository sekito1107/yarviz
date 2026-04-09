import { create } from "zustand";
import { RubyCompiler } from "../lib/ruby_wasm";
import { run } from "../core/emulator";
import type { EmulatorStore } from "./types";

export const useEmulatorStore = create<EmulatorStore>((set, get) => ({
  // State
  isWasmLoading: true,
  rawIseq: null,
  history: [],
  currentIndex: -1,

  // Actions
  initTask: () => initWasmAction(set),
  compile: (code) => compileCodeAction(set, code),
  stepForward: () => stepForwardAction(set, get),
  stepBack: () => stepBackAction(set, get),
  goToStep: (index) => goToStepAction(set, get, index),
}));

// Helper Actions

async function initWasmAction(set: any) {
  set({ isWasmLoading: true });
  try {
    await RubyCompiler.init();
    set({ isWasmLoading: false });
  } catch (error) {
    console.error("Failed to initialize Ruby WASM:", error);
  }
}

function compileCodeAction(set: any, code: string) {
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
}

function stepForwardAction(set: any, get: any) {
  const { history, currentIndex } = get();
  if (currentIndex < history.length - 1) {
    set({ currentIndex: currentIndex + 1 });
  }
}

function stepBackAction(set: any, get: any) {
  const { currentIndex } = get();
  if (currentIndex > 0) {
    set({ currentIndex: currentIndex - 1 });
  }
}

function goToStepAction(set: any, get: any, index: number) {
  const { history } = get();
  if (index >= 0 && index < history.length) {
    set({ currentIndex: index });
  }
}

