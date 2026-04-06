import { EmulatorState } from './types/emulator_state';
import { Instruction } from './types/instruction';

/**
 * 命令ハンドラの型定義
 */
type InstructionHandler = (state: EmulatorState, instruction: Instruction) => EmulatorState;

/**
 * 命令フォルダ内の全ファイルを自動スキャンして読み込む (Viteの機能)
 */
const modules = import.meta.glob('./instructions/*.ts', { eager: true });

/**
 * 命令名をキーにした辞書 (Map) を作成
 */
const instructionMap: Record<string, InstructionHandler> = {};

// 読み込んだモジュールを辞書に登録
Object.keys(modules).forEach((path) => {
  const mod = modules[path] as any;
  // ファイル名から命令名を取得 (例: ./instructions/putobject_INT2FIX_1_.ts -> putobject_INT2FIX_1_)
  const name = path.split('/').pop()?.replace('.ts', '');
  
  // モジュール内の最初に見つかった関数をハンドラとして登録
  const handler = Object.values(mod).find((f) => typeof f === 'function') as InstructionHandler;
  
  if (name && handler) {
    instructionMap[name] = handler;
  }
});

/**
 * 命令を一つ実行し、新しい状態を返す (Organizer)
 */
export function step(state: EmulatorState, instruction: Instruction): EmulatorState {
  // 共通処理: PCをインクリメントする
  const nextPc = state.pc + 1;
  const stateWithNextPc = { ...state, pc: nextPc };

  // 辞書から命令ハンドラを取得して実行
  const handler = instructionMap[instruction.name];
  
  if (handler) {
    return handler(stateWithNextPc, instruction);
  }

  // ハンドラが見つからない場合は、PCだけ進めて現在の状態を維持
  return stateWithNextPc;
}
