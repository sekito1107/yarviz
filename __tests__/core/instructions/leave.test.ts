import { it, expect } from 'vitest';
import Leave from '../../../src/core/instructions/leave';
import { createStateWithBytecode } from './helper';

it('handles the final return of the execution (single frame)', () => {
  const initialState = createStateWithBytecode(['leave'], {
    stack: [{ type: 'integer', value: 1 }],
  });

  const instruction = new Leave();
  const nextState = instruction.execute(initialState);

  expect(nextState.frames.length).toBe(0);
  expect(nextState.returnValue).toEqual({ type: 'integer', value: 1 });
});

it('handles returning to a parent frame (multiple frames)', () => {
  const initialState = createStateWithBytecode(['leave'], {
    stack: [{ type: 'integer', value: 1 }],
    name: 'child',
  });

  initialState.frames.unshift({
    name: 'parent',
    pc: 0,
    stack: [],
    iseq: { bytecode: [], lineMap: {} },
    line: 1,
  });

  const instruction = new Leave();
  const nextState = instruction.execute(initialState);

  expect(nextState.frames.length).toBe(1);
  expect(nextState.frames[0]!.name).toBe('parent');
  expect(nextState.frames[0]!.stack).toEqual([{ type: 'integer', value: 1 }]);
});
