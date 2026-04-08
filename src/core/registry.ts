import type { Instruction } from './types/instruction';

type InstructionClass = { new (): Instruction };

// Dynamically load all instruction files from the instructions directory.
// We use eager loading so the registry is populated synchronously.
const modules = import.meta.glob('./instructions/*.ts', { eager: true });
const registry: Record<string, InstructionClass> = {};

for (const path in modules) {
  // Extract file name as opcode (e.g., "./instructions/opt_plus.ts" -> "opt_plus")
  const basename = path.split('/').pop();
  if (basename) {
    const opcode = basename.replace('.ts', '');
    registry[opcode] = (modules[path] as any).default;
  }
}

// Returns the corresponding Instruction class for a given opcode.
export function getInstructionClass(opcode: string): InstructionClass | undefined {
  return registry[opcode];
}
