import { describe, it, expect } from 'vitest';
import { step, boot, run } from '../../src/core/emulator';

describe('Emulator.run', () => {
  it('executes the full program and returns the history of states', () => {
    const rawYarv = [
      "YARVInstructionSequence/SimpleDataFormat",
      4, 0, 2, 
      { "arg_size": 0, "local_size": 0, "stack_max": 2 },
      "<compiled>", "test.rb", "/home/test.rb", 1, "top",
      [], {}, [],
      [
        1,
        "RUBY_EVENT_LINE",
        ["putobject", 10],
        ["putobject", 20],
        ["opt_plus", { "mid": "+", "flag": 16, "orig_argc": 1 }],
        ["leave"]
      ]
    ];

    const history = run(rawYarv as any);

    // Initial state + putobject + putobject + opt_plus + leave = 5 states
    expect(history.length).toBe(5);
    
    // Check points in history
    expect(history[0].frames[0].stack).toEqual([]);
    expect(history[1].frames[0].stack).toEqual([{ type: 'integer', value: 10 }]);
    expect(history[2].frames[0].stack).toEqual([
      { type: 'integer', value: 10 },
      { type: 'integer', value: 20 }
    ]);
    expect(history[3].frames[0].stack).toEqual([{ type: 'integer', value: 30 }]);
    expect(history[4].frames.length).toBe(0);
    expect(history[4].returnValue).toEqual({ type: 'integer', value: 30 });


  });
});

import type { ISeq } from '../../src/core/types/iseq';
import type { EmulatorState } from '../../src/core/types/emulator_state';

const createMockISeq = (overrides: Partial<ISeq>): ISeq => ({
  magic: 'yasm/ruby',
  version: { major: 4, minor: 0, patch: 2 },
  config: { arg_size: 0, local_size: 0, stack_max: 10 },
  name: 'test',
  path: 'test.rb',
  realpath: '/test.rb',
  startLine: 1,
  type: 'top',
  locals: [],
  params: {},
  catchTable: [],
  bytecode: [],
  lineMap: {},
  ...overrides
});

describe('Emulator.step', () => {
  it('updates pc correctly based on bytecode', () => {
    const iseq = createMockISeq({
      bytecode: ['putobject_INT2FIX_1_', 'putobject', 2, 'opt_plus', 'leave'],
      lineMap: { 0: 1, 1: 2, 3: 1, 5: 1 }
    });
    
    const initialState: EmulatorState = {
      frames: [{
        pc: 0,
        stack: [],
        iseq: iseq,
        locals: {},
      }]
    };

    const state1 = step(initialState);
    expect(state1.frames[0].pc).toBe(1);

    const state2 = step(state1);
    expect(state2.frames[0].pc).toBe(3);

    const state3 = step(state2);
    expect(state3.frames[0].pc).toBe(5);
  });
});

describe('Emulator.boot', () => {
  it('boots from real Ruby 4.0.2 YARV array and populates metadata', () => {
    const rawYarv = [
      "YARVInstructionSequence/SimpleDataFormat",
      4, 0, 2, 
      { "arg_size": 0, "local_size": 0, "stack_max": 2 },
      "<compiled>", "test.rb", "/home/test.rb", 1, "top",
      [], {}, [],
      [
        1,
        "RUBY_EVENT_LINE",
        ["putobject_INT2FIX_1_"],
        ["putobject_INT2FIX_1_"],
        ["opt_plus", { "mid": "+", "flag": 16, "orig_argc": 1 }],
        ["leave"]
      ]
    ];

    const state = boot(rawYarv as any);
    const frame = state.frames[0];
    const iseq = frame.iseq;

    // Verify metadata mapping
    expect(iseq.name).toBe("<compiled>");
    expect(iseq.path).toBe("test.rb");
    expect(iseq.version.patch).toBe(2);
    expect(iseq.config.stack_max).toBe(2);

    // Verify bytecode flattening (including operands)
    expect(iseq.bytecode).toEqual([
      'putobject_INT2FIX_1_', 
      'putobject_INT2FIX_1_', 
      'opt_plus', 
      { "mid": "+", "flag": 16, "orig_argc": 1 },
      'leave'
    ]);
    
    expect(frame.pc).toBe(0);
    expect(frame.stack).toEqual([]);
    expect(frame.locals).toEqual({});
  });
});

