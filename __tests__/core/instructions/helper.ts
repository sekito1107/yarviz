import type { EmulatorState } from '../../../src/core/types/emulator_state';
import type { RubyValue } from '../../../src/core/types/ruby_value';

/**
 * Creates an EmulatorState initialized with a single frame containing the given bytecode.
 * Optimized for unit testing individual instructions.
 */
export function createStateWithBytecode(
  bytecode: any[],
  options: {
    pc?: number;
    stack?: RubyValue[];
    line?: number;
    name?: string;
  } = {}
): EmulatorState {
  const { pc = 0, stack = [], line = 1, name = 'main' } = options;

  return {
    frames: [
      {
        name,
        pc,
        stack,
        iseq: {
          bytecode,
          lineMap: { [pc]: line },
        },
        line,
      },
    ],
  };
}
