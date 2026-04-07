import { it, expect } from 'vitest';
import type { EmulatorState } from '../../../src/core/types/emulator_state';
import { step } from '../../../src/core/emulator';
import putobject_INT2FIX_0_ from '../../../src/core/instructions/putobject_INT2FIX_0_';

it('pushes integer 0 onto the stack', () => {
  const initialState: EmulatorState = {
    pc: 0,
    stack: [],
  };

  const nextState = step(initialState, putobject_INT2FIX_0_);

  expect(nextState.stack).toEqual([{ type: 'integer', value: 0 }]);
});
