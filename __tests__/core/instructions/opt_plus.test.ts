import { it, expect } from 'vitest';
import type { EmulatorState } from '../../../src/core/types/emulator_state';
import { step } from '../../../src/core/emulator';
import OptPlus from '../../../src/core/instructions/opt_plus';

it('adds two integers (1 + 1 = 2)', () => {
  const initialState: EmulatorState = {
    frames: [
      {
        name: 'main',
        pc: 0,
        stack: [
          { type: 'integer', value: 1 },
          { type: 'integer', value: 1 },
        ],
        iseq: [],
      },
    ],
  };

  const callData = { mid: '+', argc: 1 };
  const instruction = new OptPlus(callData);

  const nextState = step(initialState, instruction);

  expect(nextState.frames[0]!.stack).toEqual([{ type: 'integer', value: 2 }]);
  expect(nextState.frames[0]!.pc).toBe(1);
});
