import { describe, it, expect, vi } from "vitest";
import { RubyCompiler } from "../../src/lib/ruby_wasm";

describe("RubyCompiler (Integration)", () => {
  it("should initialize accurately and compile Ruby code to YARV", async () => {
    // window.fetch をスパイして、実際の通信が行われるのを監視する
    const fetchSpy = vi.spyOn(window, "fetch");

    // VM の初期化（実際の ruby.wasm をロード）
    await RubyCompiler.init();

    // 正しいパスに fetch が飛んでいるか確認
    expect(fetchSpy).toHaveBeenCalledWith("/ruby.wasm");

    // 実際に Ruby コードをコンパイルして YARV 配列が返ってくるか確認
    const rubyCode = "1 + 2";
    let yarv;
    try {
      yarv = RubyCompiler.compileToYarv(rubyCode);
    } catch (e: any) {
      console.error("Compilation failed:", e.message);
      throw e;
    }

    expect(Array.isArray(yarv)).toBe(true);
    expect(yarv[0]).toBe("YARVInstructionSequenceData");
    expect(yarv[5]).toBe("test_method"); // RubyCompiler.ts 内の固定名
    
    // バイトコード部分に期待される命令が含まれているか（簡易検証）
    const body = yarv[13];
    expect(JSON.stringify(body)).toContain("putobject");
    expect(JSON.stringify(body)).toContain("opt_plus");
  });

  it("should maintain singleton state and not fetch multiple times", async () => {
    const fetchSpy = vi.spyOn(window, "fetch");

    // すでに初期化済みのはずなので、追加の fetch は発生しないはず
    await RubyCompiler.init();
    await RubyCompiler.init();

    // すでにロード済みの場合は fetch は呼ばれない（initPromise が返るため）
    // ※このテスト単体で走る場合と全体で走る場合があるが、
    // シングルトンの挙動として fetch が「追加で」呼ばれないことを確認
    const initialCalls = fetchSpy.mock.calls.length;
    await RubyCompiler.init();
    expect(fetchSpy.mock.calls.length).toBe(initialCalls);
  });
});
