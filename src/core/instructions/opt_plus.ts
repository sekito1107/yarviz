import type { EmulatorState } from '../types/emulator_state';
import type { Instruction } from '../types/instruction';

/**
 * Optimized addition instruction (opt_plus).
 */
const instruction = (callData: any): Instruction => ({
  callData,
  execute(state: EmulatorState): EmulatorState {
    const { stack } = state;
    const right = stack[stack.length - 1];
    const left = stack[stack.length - 2];

    if (left?.type === 'integer' && right?.type === 'integer') {
      const result = left.value + right.value;
      const newStack = [
        ...stack.slice(0, -2),
        { type: 'integer', value: result } as const,
      ];

      return {
        ...state,
        stack: newStack,
      };
    }

    throw new Error(`opt_plus: non-integer addition not implemented yet. (left: ${left?.type}, right: ${right?.type})`);
  },
});

export default instruction;
