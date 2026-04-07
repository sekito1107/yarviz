import type { Frame } from './frame';
import type { RubyValue } from './ruby_value';

export interface EmulatorState {
  frames: Frame[];
  returnValue?: RubyValue;
}
