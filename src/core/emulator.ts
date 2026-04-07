import type { EmulatorState } from './types/emulator_state';
import type { Instruction } from './types/instruction';

export function step(state: EmulatorState, instruction: Instruction): EmulatorState {
  return instruction.execute(state);
}
