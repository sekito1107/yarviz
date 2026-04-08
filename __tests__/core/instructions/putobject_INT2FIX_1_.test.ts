import { it, expect } from 'vitest';
import PutObjectInt2Fix1 from '../../../src/core/instructions/putobject_INT2FIX_1_';
import { createStateWithBytecode } from './helper';

it('pushes integer 1 onto the stack', () => {
  const initialState = createStateWithBytecode(['putobject_INT2FIX_1_']);

  const instruction = new PutObjectInt2Fix1();
  const nextState = instruction.execute(initialState);

  expect(nextState.frames[0]!.stack).toEqual([{ type: 'integer', value: 1 }]);
  expect(nextState.frames[0]!.pc).toBe(1);
});
