/**
 * Renders an individual operand value.
 * Handles primitive types directly and expands objects into key-value pairs.
 */
export function OperandValue({ value }: { value: any }) {
  if (value === null) return <span className="val-primitive">null</span>;
  
  if (typeof value === "object") {
    return (
      <div className="val-object">
        {Object.entries(value).map(([key, val]) => (
          <div key={key} className="object-property">
            <span className="prop-key">{key}:</span>
            <span className="prop-val">{String(val)}</span>
          </div>
        ))}
      </div>
    );
  }

  return <span className="val-primitive">{String(value)}</span>;
}
