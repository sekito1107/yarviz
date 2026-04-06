import type { RubyValue } from './ruby_value';

export interface EmulatorState {
  pc: number;
  stack: RubyValue[];
}
