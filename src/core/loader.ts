import type { ISeq } from './types/iseq';

/**
 * Assembles a complete ISeq object from the raw Ruby YARV array (14 elements).
 */
export function assemble(rawYarv: any[]): ISeq {
  const [
    magic, major, minor, patch, config,
    name, path, realpath, startLine, type,
    locals, params, catchTable, rawBody
  ] = rawYarv;

  const { bytecode, lineMap } = parseBody(rawBody);

  return {
    bytecode,
    lineMap,
    magic,
    version: { major, minor, patch },
    config: {
      arg_size: config.arg_size,
      local_size: config.local_size,
      stack_max: config.stack_max,
      ...config
    },
    name,
    path,
    realpath,
    startLine,
    type,
    locals,
    params,
    catchTable
  };
}

/**
 * Parses the instruction sequence body into a flat bytecode array and a line map.
 */
function parseBody(rawBody: any[]): { bytecode: (string | number)[], lineMap: Record<number, number> } {
  const bytecode: (string | number)[] = [];
  const lineMap: Record<number, number> = {};
  let currentLine = 0;

  for (const entry of rawBody) {
    if (typeof entry === 'number') {
      currentLine = entry;
    } else if (typeof entry === 'string') {
      // Ignore trace markers like "RUBY_EVENT_LINE". 
      // These are used for debug hooks/TracePoint which are not yet implemented.
      continue;
    } else if (Array.isArray(entry)) {
      const offset = bytecode.length;
      lineMap[offset] = currentLine;
      bytecode.push(...entry);
    }
  }

  return { bytecode, lineMap };
}
