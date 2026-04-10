import type { EmulatorState } from "../core/types/emulator_state";
import type { Frame } from "../core/types/frame";
import type { RubyValue } from "../core/types/ruby_value";

export interface RubyRuntimeStore {
  isWasmLoading: boolean;
  rubyVersion: string | null;

  initTask(): Promise<void>;
}

export interface EmulatorStore {
  // State
  rawIseq: any[] | null;
  history: EmulatorState[];
  currentIndex: number;

  // Getters
  activeFrame(): Frame | null;
  activeStack(): RubyValue[] | null;

  // Actions
  compile(code: string): void;
  stepForward(): void;
  stepBack(): void;
  goToStep(index: number): void;
}
