import { EmulatorState } from './types/emulator_state';
import { Instruction } from './types/instruction';
import { instructionMap } from './instruction_loader';

/**
 * 命令を一つ実行し、新しい状態を返す (Organizer)
 * 共通処理として PC をインクリメントし、個別命令は辞書から取得して実行する
 */
export function step(state: EmulatorState, instruction: Instruction): EmulatorState {
  // 共通処理: PCをインクリメントする
  const nextPc = state.pc + 1;
  const stateWithNextPc = { ...state, pc: nextPc };

  // 辞書から命令ハンドラを取得して実行 (Loader が用意した辞書を使用)
  const handler = instructionMap[instruction.name];
  
  if (handler) {
    return handler(stateWithNextPc, instruction);
  }

  // ハンドラが見つからない場合は、PCだけ進めて現在の状態を維持
  return stateWithNextPc;
}
