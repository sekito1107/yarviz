import { Base } from './base';

// YARV format: [:opt_plus, call_data]
export default class OptPlus extends Base {
  protected readonly operandCount = 1;
  private callData: any;
 
  protected parse(): void {
    const frame = this.currentFrame;
    this.callData = frame.iseq.bytecode[frame.pc + 1];
  }

  // Core execution logic for addition
  protected call(): void {
    const right = this.pop();
    const left = this.pop();

    if (left.type === 'integer' && right.type === 'integer') {
      const result = left.value + right.value;
      this.push({ type: 'integer', value: result } as const);
      return;
    }

    throw new Error(
      `opt_plus: non-integer addition not implemented yet. (left: ${left.type}, right: ${right.type}, call_data: ${JSON.stringify(this.callData)})`
    );
  }
}
