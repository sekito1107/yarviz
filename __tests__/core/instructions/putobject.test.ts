import { it, expect } from 'vitest';
import PutObject from '../../../src/core/instructions/putobject';
import { createStateWithBytecode } from './helper';

it('pushes the operand (integer 2) onto the stack', () => {
  const initialState = createStateWithBytecode(['putobject', 2]);

  const instruction = new PutObject();
  const nextState = instruction.execute(initialState);

  expect(nextState.frames[0]!.stack).toEqual([{ type: 'integer', value: 2 }]);
  expect(nextState.frames[0]!.pc).toBe(2);
});
