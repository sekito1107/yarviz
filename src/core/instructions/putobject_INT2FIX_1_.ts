import { Base } from './base';

// Instruction to push 1 (INT2FIX(1)) onto the operand stack.
export default class PutObjectInt2Fix1 extends Base {
  protected readonly operandCount = 0;

  // YARV format: [:putobject_INT2FIX_1_]
  protected parse(): void {
    // This instruction has no operands
  }

  // Core execution logic for pushing 1
  protected call(): void {
    this.push({ type: 'integer', value: 1 } as const);
  }
}
