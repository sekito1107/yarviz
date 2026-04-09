import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useEmulatorStore } from './store/useEmulatorStore';
import { LoadingScreen } from './components/LoadingScreen';

export default function App() {
  const isWasmLoading = useEmulatorStore((state) => state.isWasmLoading);
  const rubyVersion = useEmulatorStore((state) => state.rubyVersion);
  const initTask = useEmulatorStore((state) => state.initTask);

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
            <section className="panel-container glass-panel">
              {/* Step 4: SourceEditor will go here */}
              <p className="panel-info">Source Editor Loading...</p>
            </section>

            <div className="visualization-panel">
              <section className="panel-container glass-panel">
                {/* Step 6: ValueStack will go here */}
                <h2 className="panel-title">Value Stack</h2>
                <p className="panel-info">Waiting for execution...</p>
              </section>
              <section className="panel-container glass-panel">
                {/* Step 5: InstructionList will go here */}
                <h2 className="panel-title">YARV Instructions</h2>
                <p className="panel-info">Compile code to see instructions</p>
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
