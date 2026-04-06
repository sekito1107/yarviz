import { EmulatorState } from '../types/emulator_state';
import { Instruction } from '../types/instruction';

const instruction: Instruction = {
  name: 'putobject_INT2FIX_1_',
  execute(state: EmulatorState): EmulatorState {
    return {
      ...state,
      stack: [...state.stack, { type: 'integer', value: 1 }],
    };
  },
};

export default instruction;
