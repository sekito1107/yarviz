import type { EmulatorState } from '../types/emulator_state';
import type { RubyValue } from '../types/ruby_value';
import type { Frame } from '../types/frame';

// Base abstract class for all YARV instructions.
// Provides common stack operations (pop/push) and state management.
export abstract class Base {
  protected workingState!: EmulatorState;

  // Entry point for instruction execution.
  // Called by the emulator core.
  execute(state: EmulatorState): EmulatorState {
    this.workingState = { ...state };

    // Advance PC of the current frame by default
    const frame = this.currentFrame;
    this.currentFrame = { ...frame, pc: frame.pc + 1 };
    
    this.call();

    return this.workingState;
  }

  // To be implemented by each instruction subclass.
  protected abstract call(): void;

  // Returns the currently active execution frame (the top of the stack).
  protected get currentFrame(): Frame {
    const frame = this.workingState.frames.at(-1);
    if (!frame) {
      throw new Error('No execution frame found in the current state.');
    }
    return frame;
  }

  // Updates the currently active execution frame with new data.
  protected set currentFrame(updatedFrame: Frame) {
    this.workingState = {
      ...this.workingState,
      frames: this.workingState.frames.with(-1, updatedFrame),
    };
  }

  // Pops one value from the current frame's operand stack.
  protected pop(): RubyValue {
    const { stack } = this.currentFrame;
    const value = stack.at(-1);
    
    if (value === undefined) {
      throw new Error(`Stack underflow during ${this.constructor.name} execution.`);
    }

    this.currentFrame = { ...this.currentFrame, stack: stack.slice(0, -1) };
    return value;
  }

  // Pushes one value onto the current frame's operand stack.
  protected push(value: RubyValue): void {
    const frame = this.currentFrame;
    this.currentFrame = { ...frame, stack: [...frame.stack, value] };
  }
}
