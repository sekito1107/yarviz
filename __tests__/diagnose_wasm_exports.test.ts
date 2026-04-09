import { expect, test } from 'vitest';

test('dump WASM exports', async () => {
  const response = await fetch('/public/ruby.wasm');
  const buffer = await response.arrayBuffer();
  const module = await WebAssembly.compile(buffer);
  const exports = WebAssembly.Module.exports(module);
  console.log('WASM Exports:', exports.map(e => e.name));
});
