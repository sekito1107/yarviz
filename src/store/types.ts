import type { EmulatorState } from "../core/types/emulator_state";

export interface EmulatorStore {
  isWasmLoading: boolean;
  rawIseq: any[] | null;
  rubyVersion: string | null;
  history: EmulatorState[];
  currentIndex: number;

  initTask: () => Promise<void>;
  compile: (code: string) => void;
  stepForward: () => void;
  stepBack: () => void;
  goToStep: (index: number) => void;
}
