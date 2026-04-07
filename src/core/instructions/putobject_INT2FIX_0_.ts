import { Base } from './base';

// Instruction to push 0 (INT2FIX(0)) onto the operand stack.
export default class PutObjectInt2Fix0 extends Base {
  // Core execution logic for pushing 0
  protected call(): void {
    this.push({ type: 'integer', value: 0 } as const);
  }
}
