import { describe, it, expect } from 'vitest';
import { assemble } from '../../src/core/loader';

describe('assemble', () => {
  const createRawYarv = (body: any[]): any[] => [
    'YARVInstructionSequenceData', 3, 0, 4,
    { arg_size: 0, local_size: 1, stack_max: 1 },
    'test_method', 'test.rb', '/absolute/test.rb', 1, 'top',
    [], {}, [],
    body
  ];

  it('should map metadata correctly', () => {
    const rawYarv = createRawYarv([1, ['putobject', 1], 2, ['leave']]);
    const result = assemble(rawYarv);

    expect(result.name).toBe('test_method');
    expect(result.path).toBe('test.rb');
    expect(result.version).toEqual({ major: 3, minor: 0, patch: 4 });
    expect(result.config.arg_size).toBe(0);
  });

  it('should flatten logic through assemble', () => {
    const rawYarv = createRawYarv([
      1, ['putobject', 1],
      2, ['leave']
    ]);
    const result = assemble(rawYarv);

    expect(result.bytecode).toEqual(['putobject', 1, 'leave']);
    expect(result.lineMap).toEqual({
      0: 1,
      2: 2
    });
  });

  it('should handle nested instructions arrays correctly', () => {
    // Some YARV outputs might have multi-instruction arrays in a single entry
    const rawYarv = createRawYarv([
      1, ['putobject', 1, 'putobject', 2],
      3, ['leave']
    ]);
    const result = assemble(rawYarv);

    expect(result.bytecode).toEqual(['putobject', 1, 'putobject', 2, 'leave']);
    expect(result.lineMap).toEqual({
      0: 1,
      4: 3
    });
  });

  it('should handle empty body', () => {
    const rawYarv = createRawYarv([]);
    const result = assemble(rawYarv);

    expect(result.bytecode).toEqual([]);
    expect(result.lineMap).toEqual({});
  });
});
