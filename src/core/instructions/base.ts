import type { EmulatorState } from '../types/emulator_state';
import type { RubyValue } from '../types/ruby_value';
import type { Frame } from '../types/frame';
import type { Instruction } from '../types/instruction';

// Base abstract class for all YARV instructions.
// Provides common stack operations (pop/push) and state management.
export abstract class Base implements Instruction {
  protected workingState!: EmulatorState;

  // Number of operands this instruction takes in the bytecode.
  protected abstract readonly operandCount: number;

  // Flag to indicate if the PC has been updated manually (e.g., by jumps).
  // If false, the Base class will automatically advance the PC.
  protected isPCUpdatedManually = false;

  // Entry point for instruction execution.
  // Called by the emulator core.
  execute(state: EmulatorState): EmulatorState {
    this.workingState = { ...state };
    this.isPCUpdatedManually = false;

    // 1. Parse operands from the current bytecode position
    this.parse();

    // 2. Execution logic
    this.call();

    // 3. Update PC and Line number if not handled manually
    if (!this.isPCUpdatedManually) {
      const frame = this.currentFrame;
      const nextPc = frame.pc + 1 + this.operandCount;
      const nextLine = frame.iseq.lineMap[nextPc] ?? frame.line;

      this.currentFrame = {
        ...this.currentFrame,
        pc: nextPc,
        line: nextLine,
      };
    }

    return this.workingState;
  }

  // To be implemented by each instruction subclass.
  // Parses raw YARV operands into internal properties.
  protected abstract parse(): void;

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

  // Pops the current execution frame from the frame stack.
  // Returns the popped frame.
  protected popFrame(): Frame {
    const frame = this.currentFrame;
    this.workingState = {
      ...this.workingState,
      frames: this.workingState.frames.slice(0, -1),
    };
    return frame;
  }
}
