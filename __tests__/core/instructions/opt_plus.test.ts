import { it, expect } from 'vitest';
import type { EmulatorState } from '../../../src/core/types/emulator_state';
import { step } from '../../../src/core/emulator';
import OptPlusInstruction from '../../../src/core/instructions/opt_plus';

it('adds two integers (1 + 1 = 2)', () => {
  const initialState: EmulatorState = {
    pc: 0,
    stack: [
      { type: 'integer', value: 1 },
      { type: 'integer', value: 1 },
    ],
  };

  const callData = { mid: '+', argc: 1 };
  const instruction = OptPlusInstruction(callData);

  const nextState = step(initialState, instruction);

  expect(nextState.stack).toEqual([{ type: 'integer', value: 2 }]);
});
