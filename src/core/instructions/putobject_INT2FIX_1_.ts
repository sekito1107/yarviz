import { EmulatorState } from '../types/emulator_state';
import { Instruction } from '../types/instruction';

/**
 * putobject_INT2FIX_1_ 命令を実行する (Interactor)
 * スタックに数値 1 を積む
 */
export function executePutobject_INT2FIX_1_(state: EmulatorState, _instruction: Instruction): EmulatorState {
  return {
    ...state,
    stack: [...state.stack, { type: 'integer', value: 1 }],
  };
}
