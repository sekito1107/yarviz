import { describe, it, expect, vi } from "vitest";
import { RubyCompiler } from "../../src/lib/ruby_wasm";

describe("RubyCompiler (Integration)", () => {
  it("should initialize accurately and compile Ruby code to YARV", async () => {
    const fetchSpy = vi.spyOn(window, "fetch");

    // Initialize VM with the actual ruby.wasm binary
    await RubyCompiler.init();

    expect(fetchSpy).toHaveBeenCalledWith("/ruby.wasm");

    const rubyCode = "1 + 2";
    let yarv;
    try {
      yarv = RubyCompiler.compileToYarv(rubyCode);
    } catch (e: any) {
      console.error("Compilation failed:", e.message);
      throw e;
    }

    expect(Array.isArray(yarv)).toBe(true);
    expect(yarv[0]).toBe("YARVInstructionSequence/SimpleDataFormat");
    expect(yarv[5]).toBe("<compiled>"); // Ruby 4.0.2 default label
    
    // Verify that expected instructions are present in the bytecode
    const body = yarv[13];
    expect(JSON.stringify(body)).toContain("putobject");
    expect(JSON.stringify(body)).toContain("opt_plus");
  });

  it("should maintain singleton state and not fetch multiple times", async () => {
    const fetchSpy = vi.spyOn(window, "fetch");

    // Subsequent calls to init() should not trigger additional fetches
    await RubyCompiler.init();
    await RubyCompiler.init();

    // Ensure the fetch is not called again due to singleton behavior
    const initialCalls = fetchSpy.mock.calls.length;
    await RubyCompiler.init();
    expect(fetchSpy.mock.calls.length).toBe(initialCalls);
  });
});
