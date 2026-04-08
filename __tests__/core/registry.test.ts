import { describe, it, expect } from 'vitest';
import { getInstructionClass } from '../../src/core/registry';
import OptPlus from '../../src/core/instructions/opt_plus';
import PutObject from '../../src/core/instructions/putobject';

describe('Registry', () => {
  it('should return OptPlus class for "opt_plus"', () => {
    expect(getInstructionClass('opt_plus')).toBe(OptPlus);
  });

  it('should return PutObject class for "putobject"', () => {
    expect(getInstructionClass('putobject')).toBe(PutObject);
  });

  it('should return undefined for an unknown opcode', () => {
    expect(getInstructionClass('unknown_instruction')).toBeUndefined();
  });
});
