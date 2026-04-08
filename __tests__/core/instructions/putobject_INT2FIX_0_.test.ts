import { it, expect } from 'vitest';
import PutObjectInt2Fix0 from '../../../src/core/instructions/putobject_INT2FIX_0_';
import { createStateWithBytecode } from './helper';

it('pushes integer 0 onto the stack', () => {
  const initialState = createStateWithBytecode(['putobject_INT2FIX_0_']);

  const instruction = new PutObjectInt2Fix0();
  const nextState = instruction.execute(initialState);

  expect(nextState.frames[0]!.stack).toEqual([{ type: 'integer', value: 0 }]);
  expect(nextState.frames[0]!.pc).toBe(1);
});
