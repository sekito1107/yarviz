import type { EmulatorState } from '../../../src/core/types/emulator_state';
import type { RubyValue } from '../../../src/core/types/ruby_value';
import type { ISeq } from '../../../src/core/types/iseq';

/**
 * Creates an EmulatorState initialized with a single frame containing the given bytecode.
 * Optimized for unit testing individual instructions.
 */
export function createStateWithBytecode(
  bytecode: (string | number)[],
  options: {
    pc?: number;
    stack?: RubyValue[];
    line?: number;
  } = {}
): EmulatorState {
  const { pc = 0, stack = [], line = 1 } = options;

  const mockISeq: ISeq = {
    magic: 'yasm/ruby',
    version: { major: 4, minor: 0, patch: 2 },
    config: { arg_size: 0, local_size: 0, stack_max: 10 },
    name: 'test',
    path: 'test.rb',
    realpath: '/test.rb',
    startLine: 1,
    type: 'top',
    locals: [],
    params: {},
    catchTable: [],
    bytecode,
    lineMap: { [pc]: line },
  };

  return {
    frames: [
      {
        pc,
        stack,
        iseq: mockISeq,
        locals: {},
        line,
      },
    ],
  };
}
