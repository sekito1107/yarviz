import { Base } from './base';

// leave
// Returns from the current execution frame.
export default class Leave extends Base {
  protected call(): void {
    const val = this.pop();
    this.popFrame();

    if (this.workingState.frames.length > 0) {
      this.push(val);
    } else {
      this.workingState = { ...this.workingState, returnValue: val };
    }
  }
}
