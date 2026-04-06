import { EmulatorState } from './emulator_state';

export interface Instruction {
  readonly name: string;
  execute(state: EmulatorState): EmulatorState;
}
