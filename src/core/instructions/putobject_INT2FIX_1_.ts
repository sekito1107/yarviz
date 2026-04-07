import { Base } from './base';

// Instruction to push 1 (INT2FIX(1)) onto the operand stack.
export default class PutObjectInt2Fix1 extends Base {
  // Core execution logic for pushing 1
  protected call(): void {
    this.push({ type: 'integer', value: 1 } as const);
  }
}
