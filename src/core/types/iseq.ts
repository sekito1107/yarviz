export interface ISeq {
  bytecode: (string | number)[];
  lineMap: Record<number, number>;
}
