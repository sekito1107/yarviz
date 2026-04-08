export type RubyValue =
  | { type: 'integer'; value: number }
  | { type: 'string'; value: string }
  | { type: 'nil'; value: null };
