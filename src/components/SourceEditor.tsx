import { useState, useRef, useEffect, useCallback } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { useEmulatorStore } from '../store/emulatorStore';
import { RUBY_EDITOR_PROPS } from '../config/editorConfig';

/**
 * Standard Source Code Editor component with synchronized execution highlighting.
 */
export function SourceEditor() {
  const [localCode, setLocalCode] = useState("1 + 2");
  
  // Store interaction
  const compile = useEmulatorStore((state) => state.compile);
  const currentIndex = useEmulatorStore((state) => state.currentIndex);
  const history = useEmulatorStore((state) => state.history);

  // Monaco interaction
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  // Correctly derive current execution line using lineMap from the active ISeq.
  const currentLine: number | null = useEmulatorStore((state): number | null => {
    const { history, currentIndex } = state;
    if (history.length === 0 || currentIndex < 0) return null;
    
    const snapshot = history[currentIndex];
    const topFrame = snapshot?.frames?.at(-1);
    const rootISeq = history[0]?.frames[0]?.iseq;
    
    // Only highlight if we're in the scope of the root instruction sequence.
    if (topFrame && topFrame.iseq === rootISeq) {
      return topFrame.iseq.lineMap[topFrame.pc] ?? null;
    }
    return null;
  });

  /**
   * Applies execution highlighting decorations to the editor.
   */
  const applyDecorations = useCallback((line: number | null) => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    const newDecorations = line ? [
      {
        range: new monaco.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: 'active-line-content',
          glyphMarginClassName: 'active-line-decoration',
          revealOnMarkerChange: true,
        }
      }
    ] : [];

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );

    if (line) {
      editor.revealLineInCenterIfOutsideViewport(line);
    }
  }, []);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    // Highlight initial line if compilation finished before mount.
    if (currentLine !== null) {
      applyDecorations(currentLine);
    }
  };

  // Sync highlighting effect whenever execution state or history updates.
  useEffect(() => {
    if (!editorRef.current) return;
    
    // Defer decoration application to the next frame to ensure Monaco buffer is stable.
    const rafId = requestAnimationFrame(() => {
      applyDecorations(currentLine);
    });

    return () => cancelAnimationFrame(rafId);
  }, [currentLine, currentIndex, history, applyDecorations]);

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
          onMount={handleEditorDidMount}
          onChange={(value) => setLocalCode(value || "")}
        />
      </div>
    </div>
  );
}
