import { useEmulatorStore } from "../store/emulatorStore";
import { OperandValue } from "./InstructionList/OperandValue";

/**
 * Component for displaying YARV instructions in a tabular format.
 * Includes a fixed header and 4 distinct columns for Line, PC, Opcode, and Arguments.
 * 
 * Interactive Feature: Clicking a row jumps the emulator to the moment 
 * that specific instruction was executed as the top frame.
 */
export function InstructionList() {
  const parsedInstructions = useEmulatorStore((state) => state.parsedInstructions);
  const history = useEmulatorStore((state) => state.history);
  const goToStep = useEmulatorStore((state) => state.goToStep);
  const activeFrame = useEmulatorStore((state) => state.activeFrame());
  const pc = activeFrame?.pc ?? -1;

  // Jump to the first history entry where this instruction is the top of the stack.
  const handleInstructionClick = (offset: number) => {
    if (history.length === 0 || !history[0].frames[0]) return;

    // We assume the current list displays the Root ISeq for now.
    // In multi-frame scenarios, we would compare with the ISeq actually being displayed.
    const rootISeq = history[0].frames[0].iseq;

    const targetStepIndex = history.findIndex(step => {
      const topFrame = step.frames[step.frames.length - 1];
      return topFrame && topFrame.iseq === rootISeq && topFrame.pc === offset;
    });

    if (targetStepIndex !== -1) {
      goToStep(targetStepIndex);
    }
  };

  if (parsedInstructions.length === 0) {
    return (
      <div className="instruction-list empty">
        <div className="instruction-placeholder">
          <p>Compile some Ruby code to see its YARV instructions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="instruction-list">
      <div className="instruction-header">
        <span className="col-line">Line</span>
        <span className="col-pc">PC</span>
        <span className="col-opcode">Opcode</span>
        <span className="col-operands">Arguments</span>
      </div>

      <div className="instruction-container">
        {parsedInstructions.map((instr, index) => {
          const isCurrent = instr.offset === pc;
          
          // Only show the line number if it's the first instruction of that line
          const prevInstr = parsedInstructions[index - 1];
          const showLine = !prevInstr || prevInstr.line !== instr.line;

          return (
            <div
              key={instr.offset}
              className={`instruction-row ${isCurrent ? "active" : ""}`}
              id={`instr-${instr.offset}`}
              onClick={() => handleInstructionClick(instr.offset)}
              title={`Jump to step executing ${instr.opcode}`}
            >
              <div className="col-line">
                {showLine ? instr.line : ""}
              </div>
              <div className="col-pc">
                [{instr.offset.toString().padStart(2, '0')}]
              </div>
              <div className="col-opcode">
                {instr.opcode}
              </div>
              <div className="col-operands">
                <div className="operand-group">
                  {instr.operands.map((op, i) => (
                    <OperandValue key={i} value={op} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
