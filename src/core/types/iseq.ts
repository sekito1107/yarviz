export interface ISeq {
  // Pure execution data
  bytecode: (string | number)[];
  lineMap: Record<number, number>;

  // Full YARV Metadata (mapped from 14 elements)
  magic: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  config: {
    arg_size: number;
    local_size: number;
    stack_max: number;
    [key: string]: unknown;
  };
  name: string;
  path: string;
  realpath: string;
  startLine: number;
  type: string;
  locals: string[];
  params: Record<string, unknown>;
  catchTable: Record<string, unknown>[];
}


