import { it, expect } from 'vitest';
import type { EmulatorState } from '../../../src/core/types/emulator_state';
import { step } from '../../../src/core/emulator';
import PutObjectInstruction from '../../../src/core/instructions/putobject';

it('pushes the operand (integer 2) onto the stack', () => {
  const initialState: EmulatorState = {
    pc: 0,
    stack: [],
  };

  const operand = { type: 'integer', value: 2 } as const;
  const instruction = new PutObjectInstruction(operand);

  const nextState = step(initialState, instruction);

  expect(nextState.stack).toEqual([operand]);
});
