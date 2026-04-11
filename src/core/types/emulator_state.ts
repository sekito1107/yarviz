import type { Frame } from './frame';
import type { RubyValue } from './ruby_value';
import type { ISeq } from './iseq';

export interface EmulatorState {
  frames: Frame[];
  methods: Record<string, ISeq>;
  returnValue?: RubyValue;
}
