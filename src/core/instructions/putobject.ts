import type { EmulatorState } from '../types/emulator_state';
import type { Instruction } from '../types/instruction';
import type { RubyValue } from '../types/ruby_value';

const instruction = (operand: RubyValue): Instruction => ({
  operand,
  execute(state: EmulatorState): EmulatorState {
    return {
      ...state,
      stack: [...state.stack, this.operand],
    };
  },
});

export default instruction;
