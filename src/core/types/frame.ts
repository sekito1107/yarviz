import type { RubyValue } from './ruby_value';
import type { ISeq } from './iseq';

export interface Frame {
  name: string;
  pc: number;
  stack: RubyValue[];
  iseq: ISeq;
  line?: number;
}
