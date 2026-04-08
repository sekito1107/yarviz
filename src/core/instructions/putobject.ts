import { Base } from './base';
import type { RubyValue } from '../types/ruby_value';

export default class PutObject extends Base {
  protected readonly operandCount = 1;
  private operand!: RubyValue;

  // YARV format: [:putobject, value]
  protected parse(): void {
    const frame = this.currentFrame;
    const rawValue = frame.iseq.bytecode[frame.pc + 1];

    if (rawValue === null) {
      this.operand = { type: 'nil', value: null };
    } else if (typeof rawValue === 'number') {
      this.operand = { type: 'integer', value: rawValue };
    } else if (typeof rawValue === 'string') {
      this.operand = { type: 'string', value: rawValue };
    } else {
      this.operand = { type: 'string', value: String(rawValue) };
    }
  }

  // Core execution logic for pushing the operand
  protected call(): void {
    this.push(this.operand);
  }
}
