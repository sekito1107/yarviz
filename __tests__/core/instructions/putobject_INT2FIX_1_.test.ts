import { it, expect } from 'vitest';
import { EmulatorState } from '../../../src/core/types/emulator_state';
import { Instruction } from '../../../src/core/types/instruction';
// @ts-ignore
import { step } from '../../../src/core/emulator';

it('putobject_INT2FIX_1_ pushes 1 onto the stack', () => {
  const initialState: EmulatorState = {
    pc: 0,
    stack: [],
  };

  const instruction: Instruction = {
    name: 'putobject_INT2FIX_1_',
  };

  const nextState = step(initialState, instruction);

  expect(nextState.stack).toEqual([
    { type: 'integer', value: 1 }
  ]);
});
