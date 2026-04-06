import { describe, it, expect } from 'vitest';
import { EmulatorState } from '../../src/core/types/emulator_state';
import { Instruction } from '../../src/core/types/instruction';
import { step } from '../../src/core/emulator';

describe('Emulator', () => {
  describe('putobject', () => {
    it('pushes an object onto the stack and increments PC', () => {
      const initialState: EmulatorState = {
        pc: 0,
        stack: [],
      };
      const instruction: Instruction = {
        name: 'putobject',
        operand: { type: 'integer', value: 1 },
      };

      const nextState = step(initialState, instruction);

      expect(nextState.pc).toBe(1);
      expect(nextState.stack).toEqual([
        { type: 'integer', value: 1 }
      ]);
    });
  });
});
