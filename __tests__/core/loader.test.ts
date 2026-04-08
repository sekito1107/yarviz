import { describe, it, expect } from 'vitest';
import { flatten } from '../../src/core/loader';

describe('flatten', () => {
  it('should generate flat bytecode and lineMap from raw iseq', () => {
    const rawISeq = [1, ['putobject', 1]];
    const result = flatten(rawISeq);

    expect(result.bytecode).toEqual(['putobject', 1]);
    expect(result.lineMap).toEqual({ 0: 1 });
  });

  it('should calculate correct offsets for multiple instructions', () => {
    const rawISeq = [
      1, ['putobject', 1],
      2, ['leave']
    ];
    const result = flatten(rawISeq);

    expect(result.bytecode).toEqual(['putobject', 1, 'leave']);
    expect(result.lineMap).toEqual({
      0: 1,
      2: 2
    });
  });
});
