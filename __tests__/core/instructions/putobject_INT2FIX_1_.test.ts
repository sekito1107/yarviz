import { it, expect } from 'vitest';
import type { EmulatorState } from '../../../src/core/types/emulator_state';
import { step } from '../../../src/core/emulator';
import PutObjectInt2Fix1 from '../../../src/core/instructions/putobject_INT2FIX_1_';

it('pushes integer 1 onto the stack', () => {
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

  const instruction = new PutObjectInt2Fix1();
  const nextState = step(initialState, instruction);

  expect(nextState.frames[0]!.stack).toEqual([{ type: 'integer', value: 1 }]);
  expect(nextState.frames[0]!.pc).toBe(1);
});
