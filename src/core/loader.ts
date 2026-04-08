import type { ISeq } from './types/iseq';

export function flatten(rawISeq: any[]): ISeq {
  const bytecode: (string | number)[] = [];
  const lineMap: Record<number, number> = {};
  let currentLine = 0;

  for (const entry of rawISeq) {
    if (typeof entry === 'number') {
      currentLine = entry;
    } else if (Array.isArray(entry)) {
      const offset = bytecode.length;
      lineMap[offset] = currentLine;
      bytecode.push(...entry);
    }
  }

  return { bytecode, lineMap };
}
