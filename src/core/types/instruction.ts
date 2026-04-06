import { RubyValue } from './ruby_value';

export type Instruction =
  | { name: 'putobject'; operand: RubyValue }
  | { name: 'opt_plus' }
  | { name: 'leave' };
