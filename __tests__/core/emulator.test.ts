import { describe, it, expect } from 'vitest';
import { step } from '../../src/core/emulator';
import type { ISeq } from '../../src/core/types/iseq';
import type { EmulatorState } from '../../src/core/types/emulator_state';

describe('Emulator.step', () => {
  it('updates pc and line number correctly based on flattened bytecode', () => {
    const iseq: ISeq = {
      bytecode: ['putobject_INT2FIX_1_', 'putobject', 2, 'opt_plus', 'leave'],
      lineMap: { 
        0: 1, 
        1: 2,
        3: 1,
        5: 1
      }
    };
    
    const initialState: EmulatorState = {
      frames: [{
        name: 'top',
        pc: 0,
        stack: [],
        iseq: iseq,
        line: 1
      }]
    };

    const state1 = step(initialState);
    expect(state1.frames[0].pc).toBe(1);
    expect(state1.frames[0].line).toBe(2);

    const state2 = step(state1);
    expect(state2.frames[0].pc).toBe(3);
    expect(state2.frames[0].line).toBe(1);

    const state3 = step(state2);
    expect(state3.frames[0].pc).toBe(5);
    expect(state3.frames[0].line).toBe(1);
  });
});
