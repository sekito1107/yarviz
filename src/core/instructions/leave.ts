import { Base } from './base';

// leave
// Returns from the current execution frame.
export default class Leave extends Base {
  protected readonly operandCount = 0;

  // YARV format: [:leave]
  protected parse(): void {
    // leave instruction has no operands
  }

  protected call(): void {
    const val = this.pop();
    this.popFrame();
    this.isPCUpdatedManually = true;

    if (this.workingState.frames.length > 0) {
      this.push(val);
    } else {
      this.workingState = { ...this.workingState, returnValue: val };
    }
  }
}
