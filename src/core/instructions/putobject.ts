import { Base } from './base';
import type { RubyValue } from '../types/ruby_value';

// Instruction to push a literal object onto the operand stack.
export default class PutObject extends Base {
  constructor(public readonly operand: RubyValue) {
    super();
  }

  // Core execution logic for pushing the operand
  protected call(): void {
    this.push(this.operand);
  }
}
