import type { EditorProps } from '@monaco-editor/react';

/**
 * Common configuration for Monaco Editor across the application.
 */
export const COMMON_EDITOR_OPTIONS: EditorProps['options'] = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on',
  scrollBeyondLastLine: false,
  automaticLayout: true,
  padding: { top: 10 },
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  tabSize: 2,
  cursorSmoothCaretAnimation: 'on',
  smoothScrolling: true,
  renderLineHighlight: 'all',
};

/**
 * Default props for the Ruby source editor.
 */
export const RUBY_EDITOR_PROPS: Partial<EditorProps> = {
  height: "100%",
  defaultLanguage: "ruby",
  theme: "vs-dark",
  options: COMMON_EDITOR_OPTIONS,
};
