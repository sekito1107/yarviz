import { EmulatorState } from './emulator_state';

export interface Instruction {
  execute(state: EmulatorState): EmulatorState;
}
