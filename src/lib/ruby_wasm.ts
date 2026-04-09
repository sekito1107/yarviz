import { DefaultRubyVM } from "@ruby/wasm-wasi/dist/browser";

type RubyVMInstance = Awaited<ReturnType<typeof DefaultRubyVM>>["vm"];

let vmInstance: RubyVMInstance | null = null;
let initPromise: Promise<void> | null = null;

export const RubyCompiler = {
  /**
   * Fetches the Ruby WASM binary and initializes the VM.
   * Expected to be called exactly once during the application startup.
   */
  async init(): Promise<void> {
    if (initPromise) return initPromise;

    initPromise = (async () => {
      // Load the manually hosted binary from the public directory
      const response = await fetch("/ruby.wasm");
      const module = await WebAssembly.compileStreaming(response);
      const { vm } = await DefaultRubyVM(module);
      vmInstance = vm;
    })();

    return initPromise;
  },

  /**
   * Evaluates the given Ruby code and returns the parsed YARV InstructionSequence as a raw JSON array.
   */
  compileToYarv(rubyCode: string): any[] {
    if (!vmInstance) {
      throw new Error("RubyVM is not initialized. Call RubyCompiler.init() first.");
    }

    // Use a heredoc to safely pass the ruby string and convert the compiled instruction sequence to JSON
    const script = `
require 'json'
RubyVM::InstructionSequence.compile(<<~'RUBY').to_a.to_json
${rubyCode}
RUBY
    `;

    const jsonString = vmInstance.eval(script).toString();
    return JSON.parse(jsonString); // Parse the resulting JSON string back into a JS array
  }
};
