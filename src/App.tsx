import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRubyRuntimeStore } from './store/rubyRuntimeStore';
import { LoadingScreen } from './components/LoadingScreen';
import { SourceEditor } from './components/SourceEditor';
import { ValueStack } from './components/ValueStack';
import { InstructionList } from './components/InstructionList';

export default function App() {
  const isWasmLoading = useRubyRuntimeStore((state) => state.isWasmLoading);
  const rubyVersion = useRubyRuntimeStore((state) => state.rubyVersion);
  const initTask = useRubyRuntimeStore((state) => state.initTask);

  // Initialize Ruby WASM on mount
  useEffect(() => {
    initTask();
  }, [initTask]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isWasmLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      {!isWasmLoading && (
        <div className="app-container">
          <header className="app-header glass-panel">
            <h1 className="logo">YARViz</h1>
            <span className="subtitle">{rubyVersion || 'Ruby Visualizer'}</span>
          </header>

          <main className="main-content">
            <SourceEditor />

            <div className="visualization-panel">
              <section className="panel-container glass-panel">
                <h2 className="panel-title">Value Stack</h2>
                <ValueStack />
              </section>
              <section className="panel-container glass-panel">
                <InstructionList />
              </section>
            </div>
          </main>

          <footer className="app-footer">
            &copy; 2026 YARViz - Exploring Ruby Internals
          </footer>
        </div>
      )}
    </>
  );
}
