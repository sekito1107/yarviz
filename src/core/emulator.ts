import { EmulatorState } from './types/emulator_state';
import { Instruction } from './types/instruction';

export function step(state: EmulatorState, instruction: Instruction): EmulatorState {
  const nextPc = state.pc + 1;
  const stateWithNextPc = { ...state, pc: nextPc };

  return instruction.execute(stateWithNextPc);
}
