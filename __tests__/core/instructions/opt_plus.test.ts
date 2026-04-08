import { it, expect } from 'vitest';
import OptPlus from '../../../src/core/instructions/opt_plus';
import { createStateWithBytecode } from './helper';

it('adds two integers (1 + 1 = 2)', () => {
  const callData = { mid: '+', argc: 1 };
  const initialState = createStateWithBytecode(['opt_plus', callData], {
    stack: [
      { type: 'integer', value: 1 },
      { type: 'integer', value: 1 },
    ],
  });

  const instruction = new OptPlus();
  const nextState = instruction.execute(initialState);

  expect(nextState.frames[0]!.stack).toEqual([{ type: 'integer', value: 2 }]);
  expect(nextState.frames[0]!.pc).toBe(2);
});
