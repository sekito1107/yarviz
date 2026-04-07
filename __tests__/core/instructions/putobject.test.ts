import { it, expect } from 'vitest';
import type { EmulatorState } from '../../../src/core/types/emulator_state';
import { step } from '../../../src/core/emulator';
import PutObject from '../../../src/core/instructions/putobject';

it('pushes the operand (integer 2) onto the stack', () => {
  const initialState: EmulatorState = {
    frames: [
      {
        name: 'main',
        pc: 0,
        stack: [],
        iseq: [],
      },
    ],
  };

  const operand = { type: 'integer', value: 2 } as const;
  const instruction = new PutObject(operand);

  const nextState = step(initialState, instruction);

  expect(nextState.frames[0]!.stack).toEqual([operand]);
  expect(nextState.frames[0]!.pc).toBe(1);
});
