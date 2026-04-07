import { it, expect } from 'vitest';
import type { EmulatorState } from '../../../src/core/types/emulator_state';
import { step } from '../../../src/core/emulator';
// @ts-expect-error
import Leave from '../../../src/core/instructions/leave';

it('handles the final return of the execution (single frame)', () => {
  const initialState: EmulatorState = {
    frames: [
      {
        name: 'main',
        pc: 0,
        stack: [{ type: 'integer', value: 1 }],
        iseq: [],
      },
    ],
  };

  const instruction = new Leave();
  const nextState = step(initialState, instruction);

  expect(nextState.frames.length).toBe(0);
  // @ts-expect-error
  expect(nextState.returnValue).toEqual({ type: 'integer', value: 1 });
});

it('handles returning to a parent frame (multiple frames)', () => {
  const initialState: EmulatorState = {
    frames: [
      { name: 'parent', pc: 0, stack: [], iseq: [] },
      { name: 'child', pc: 0, stack: [{ type: 'integer', value: 1 }], iseq: [] },
    ],
  };

  const instruction = new Leave();
  const nextState = step(initialState, instruction);

  expect(nextState.frames.length).toBe(1);
  expect(nextState.frames[0]!.name).toBe('parent');
  expect(nextState.frames[0]!.stack).toEqual([{ type: 'integer', value: 1 }]);
});
