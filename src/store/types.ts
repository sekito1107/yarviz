import type { EmulatorState } from "../core/types/emulator_state";
import type { Frame } from "../core/types/frame";
import type { RubyValue } from "../core/types/ruby_value";

/**
 * A single YARV instruction parsed from bytecode for display purposes.
 * Computed once at compile time from ISeq's lineMap and bytecode.
 */
export interface ParsedInstruction {
  offset: number;                  // PC (position in flat bytecode)
  opcode: string;                  // instruction name (e.g. "putobject")
  operands: (string | number)[];   // arguments to the instruction
  line: number;                    // source code line number
}

export interface RubyRuntimeStore {
  isWasmLoading: boolean;
  rubyVersion: string | null;

  initTask(): Promise<void>;
}

export interface EmulatorStore {
  // State
  rawIseq: any[] | null;
  parsedInstructions: ParsedInstruction[];
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
