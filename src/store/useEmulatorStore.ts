import { create } from "zustand";
import { RubyCompiler } from "../lib/ruby_wasm";
import { boot } from "../core/emulator";
import { EmulatorStore } from "./types";


export const useEmulatorStore = create<EmulatorStore>((set, get) => ({

  // State
  isWasmLoading: true,
  rawIseq: null,
  history: [],
  currentIndex: -1,

  // Actions (Thinned by moving implementation logic to Helper Actions)
  initTask: () => initWasmAction(set),
  compile: (code) => compileCodeAction(set, code),
  stepForward: () => stepForwardAction(set, get),
}));

// Helper Actions (Business Logic)

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
    const initialState = boot(rawYarv);

    set({
      rawIseq: rawYarv,
      history: [initialState],
      currentIndex: 0,
    });
  } catch (error) {
    console.error("Compilation failed:", error);
  }
}


function stepForwardAction(set: any, get: any) {
  const { history, currentIndex } = get();
  if (currentIndex < 0 || currentIndex >= history.length) return;
  
  console.log("Step forward logic integration pending.");
}

