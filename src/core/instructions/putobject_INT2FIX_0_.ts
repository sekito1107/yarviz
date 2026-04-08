import { Base } from './base';

// Instruction to push 0 (INT2FIX(0)) onto the operand stack.
export default class PutObjectInt2Fix0 extends Base {
  protected readonly operandCount = 0;

  // YARV format: [:putobject_INT2FIX_0_]
  protected parse(): void {
    // This instruction has no operands
  }

  // Core execution logic for pushing 0
  protected call(): void {
    this.push({ type: 'integer', value: 0 } as const);
  }
}
