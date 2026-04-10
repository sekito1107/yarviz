import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useEmulatorStore } from '../store/emulatorStore';
import { RUBY_EDITOR_PROPS } from '../config/editorConfig';

export function SourceEditor() {
  const [localCode, setLocalCode] = useState("1 + 2");
  const compile = useEmulatorStore((state) => state.compile);

  return (
    <div className="panel-container glass-panel h-full">
      <div className="panel-header">
        <h2 className="panel-title m-0">Source Code</h2>
        <button className="compile-button" onClick={() => compile(localCode)}>
          Compile
        </button>
      </div>

      <div className="editor-wrapper">
        <Editor
          {...RUBY_EDITOR_PROPS}
          defaultValue={localCode}
          onChange={(value) => setLocalCode(value || "")}
        />
      </div>
    </div>
  );
}
