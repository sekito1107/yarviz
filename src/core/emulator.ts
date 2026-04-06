import { EmulatorState } from './types/emulator_state';
import { Instruction } from './types/instruction';
import { executePutobject_INT2FIX_1_ } from './instructions/putobject_INT2FIX_1_';

/**
 * 命令を一つ実行し、新しい状態を返す (Organizer)
 */
export function step(state: EmulatorState, instruction: Instruction): EmulatorState {
  // 共通処理: PCをインクリメントする
  const nextPc = state.pc + 1;
  const stateWithNextPc = { ...state, pc: nextPc };

  // 命令ごとにハンドラを呼び出す
  switch (instruction.name) {
    case 'putobject_INT2FIX_1_':
      return executePutobject_INT2FIX_1_(stateWithNextPc, instruction);
    
    // 今後ここに命令が増えていきます
    default:
      return stateWithNextPc;
  }
}
