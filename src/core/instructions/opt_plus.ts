import { Base } from './base';

// Instruction for addition (+)
export default class OptPlus extends Base {
  constructor(public readonly callData: any) {
    super();
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

    throw new Error(`opt_plus: non-integer addition not implemented yet. (left: ${left.type}, right: ${right.type})`);
  }
}
