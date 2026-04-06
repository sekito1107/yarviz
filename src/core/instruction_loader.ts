import { EmulatorState } from './types/emulator_state';
import { Instruction } from './types/instruction';

/**
 * 命令ハンドラの型定義
 */
export type InstructionHandler = (state: EmulatorState, instruction: Instruction) => EmulatorState;

/**
 * 命令フォルダ内の全ファイルを自動スキャンして読み込む (Viteの機能)
 */
const modules = import.meta.glob('./instructions/*.ts', { eager: true });

/**
 * 命令名をキーにした辞書 (Map)
 */
const instructionMap: Record<string, InstructionHandler> = {};

// 読み込んだモジュールから、各命令の名前をキーにしてハンドラを登録
Object.keys(modules).forEach((path) => {
  const mod = modules[path] as any;
  // パス名からファイル名（命令名）を抽出
  const name = path.split('/').pop()?.replace('.ts', '');
  
  // モジュール内の最初に見つかった関数（Interactor）を取得
  const handler = Object.values(mod).find((f) => typeof f === 'function') as InstructionHandler;
  
  if (name && handler) {
    instructionMap[name] = handler;
  }
});

/**
 * 構築済みの命令マップを公開
 */
export { instructionMap };
