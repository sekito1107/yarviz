import { useEmulatorStore } from "../store/emulatorStore";
import { OperandValue } from "./InstructionList/OperandValue";

/**
 * Component for displaying YARV instructions in a tabular format.
 * Includes a fixed header and 4 distinct columns for Line, PC, Opcode, and Arguments.
 * 
 * Note: Panel titles are managed by the parent layout (App.tsx) to ensure
 * visual consistency across all panels.
 */
export function InstructionList() {
  const parsedInstructions = useEmulatorStore((state) => state.parsedInstructions);
  const activeFrame = useEmulatorStore((state) => state.activeFrame());
  const pc = activeFrame?.pc ?? -1;

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
