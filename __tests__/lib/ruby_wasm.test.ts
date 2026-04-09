import { describe, it, expect, vi, beforeEach } from "vitest";
import { DefaultRubyVM } from "@ruby/wasm-wasi/dist/browser";
import { RubyCompiler } from "../../src/lib/ruby_wasm";

// Mock @ruby/wasm-wasi
vi.mock("@ruby/wasm-wasi/dist/browser", () => ({
  DefaultRubyVM: vi.fn(),
}));

describe("RubyCompiler", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    
    // Mock global fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
    } as Response);

    // Mock WebAssembly.compileStreaming
    global.WebAssembly.compileStreaming = vi.fn().mockResolvedValue({} as WebAssembly.Module);

    // Mock DefaultRubyVM implementation
    vi.mocked(DefaultRubyVM).mockResolvedValue({
      vm: { eval: vi.fn() } as any,
    });
  });

  describe("init", () => {
    it("should fetch ruby.wasm exactly once when called concurrently", async () => {
      // Call init multiple times concurrently
      const p1 = RubyCompiler.init();
      const p2 = RubyCompiler.init();
      const p3 = RubyCompiler.init();

      await Promise.all([p1, p2, p3]);

      // fetch should be called only once
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith("/ruby.wasm");
    });
  });
});
