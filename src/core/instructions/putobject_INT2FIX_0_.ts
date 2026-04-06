import type { EmulatorState } from '../types/emulator_state';
import type { Instruction } from '../types/instruction';

const instruction: Instruction = {
  execute(state: EmulatorState): EmulatorState {
    return {
      ...state,
      stack: [...state.stack, { type: 'integer', value: 0 }],
    };
  },
};

export default instruction;
