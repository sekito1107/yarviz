import { assemble } from './loader';
import type { EmulatorState } from './types/emulator_state';
import { getInstructionClass } from './registry';

/**
 * Boots the emulator with the given raw YARV data.
 * This encapsulates the initial state creation logic.
 */
export function boot(rawYarv: any[]): EmulatorState {
  const iseq = assemble(rawYarv);

  return {
    frames: [
      {
        iseq,
        pc: 0,
        stack: [],
        locals: {},
      },
    ],
  };
}

/**
 * Executes a single step of the YARV emulator.
 * It fetches the current opcode from the bytecode at the Program Counter (PC),
 * decodes it using the instruction registry, and executes it.
 * 
 * @param state The current emulator state
 * @returns The updated emulator state after one instruction execution
 */
export function step(state: EmulatorState): EmulatorState {
  // Get the topmost frame
  const frame = state.frames.at(-1);
  if (!frame) {
    return state;
  }

  // Fetch the opcode at the current PC
  const opcode = frame.iseq.bytecode[frame.pc];
  if (typeof opcode !== 'string') {
    throw new Error(`Invalid opcode at PC ${frame.pc}: ${opcode} (type: ${typeof opcode})`);
  }

  // Look up the instruction class in the registry
  const InstructionClass = getInstructionClass(opcode);
  if (!InstructionClass) {
    throw new Error(`Unknown opcode: ${opcode}`);
  }

  // Instantiate and execute the instruction
  const instruction = new InstructionClass();
  return instruction.execute(state);
}
