import { describe, it, expect } from 'vitest';
import { Base } from '../../../src/core/instructions/base';
import type { EmulatorState } from '../../../src/core/types/emulator_state';
import type { RubyValue } from '../../../src/core/types/ruby_value';
import { createStateWithBytecode } from './helper';

class MockInstruction extends Base {
  constructor(private action: (ins: MockInstruction) => void) {
    super();
  }

  readonly opcode = 'mock';
  readonly operandCount = 0;

  protected parse(): void {}

  protected call(): void {
    this.action(this);
  }

  public testPush(val: RubyValue) { this.push(val); }
  public testPop() { return this.pop(); }
}

describe('Base Instruction', () => {
  const initialState = createStateWithBytecode([]);

  it('should increment PC automatically before calling logic', () => {
    const ins = new MockInstruction(() => {});
    const nextState = ins.execute(initialState);
    
    expect(nextState.frames[0]!.pc).toBe(1);
  });

  it('should handle push operation correctly', () => {
    const val: RubyValue = { type: 'integer', value: 42 };
    const ins = new MockInstruction((i) => i.testPush(val));
    
    const nextState = ins.execute(initialState);
    expect(nextState.frames[0]!.stack).toEqual([val]);
  });

  it('should handle pop operation correctly', () => {
    const val: RubyValue = { type: 'integer', value: 42 };
    const stateWithStack: EmulatorState = {
      frames: [{ ...initialState.frames[0]!, stack: [val] }],
    };

    const ins = new MockInstruction((i) => {
      const popped = i.testPop();
      expect(popped).toEqual(val);
    });

    const nextState = ins.execute(stateWithStack);
    expect(nextState.frames[0]!.stack).toEqual([]);
  });

  it('should throw error on stack underflow', () => {
    const ins = new MockInstruction((i) => i.testPop());
    expect(() => ins.execute(initialState)).toThrow('Stack underflow');
  });
});
