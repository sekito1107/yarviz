import type { RubyValue } from './ruby_value';
import type { Instruction } from './instruction';

export interface Frame {
  name: string;
  pc: number;
  stack: RubyValue[];
  iseq: Instruction[];
}
