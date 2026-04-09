import type { RubyValue } from './ruby_value';
import type { ISeq } from './iseq';

export interface Frame {
  iseq: ISeq;
  pc: number;
  stack: RubyValue[];
  locals: Record<string, RubyValue>;
  line?: number;
}


