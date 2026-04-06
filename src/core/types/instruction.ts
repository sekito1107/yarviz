import { RubyValue } from './ruby_value';

export interface CallData {
  mid: string;
  flag: number;
  orig_argc: number;
}

export type Instruction =
  | { name: 'putobject_INT2FIX_1_' }
  | { name: 'putobject'; operand: RubyValue }
  | { name: 'opt_plus'; operand: CallData }
  | { name: 'leave' };
