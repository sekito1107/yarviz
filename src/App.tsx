import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRubyRuntimeStore } from './store/rubyRuntimeStore';
import { useEmulatorStore } from './store/emulatorStore';
import { LoadingScreen } from './components/LoadingScreen';
import { SourceEditor } from './components/SourceEditor';
import { ValueStack } from './components/ValueStack';
import { InstructionList } from './components/InstructionList';

export default function App() {
  const isWasmLoading = useRubyRuntimeStore((state) => state.isWasmLoading);
  const rubyVersion = useRubyRuntimeStore((state) => state.rubyVersion);
  const initTask = useRubyRuntimeStore((state) => state.initTask);

  // Emulator State & Actions
  const history = useEmulatorStore((state) => state.history);
  const currentIndex = useEmulatorStore((state) => state.currentIndex);
  const stepForward = useEmulatorStore((state) => state.stepForward);
  const stepBack = useEmulatorStore((state) => state.stepBack);
  const goToStep = useEmulatorStore((state) => state.goToStep);

  const hasHistory = history.length > 0;
  const canStepForward = currentIndex < history.length - 1;
  const canStepBack = currentIndex > 0;

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
            <div className="header-actions">
              <span className="subtitle">{rubyVersion || 'Ruby Visualizer'}</span>
            </div>
          </header>

          <main className="main-content">
            <SourceEditor />

            <div className="visualization-panel">
              <section className="panel-container glass-panel">
                <header className="panel-header-with-actions">
                  <h2 className="panel-title">Execution Controls</h2>
                  {hasHistory && (
                    <div className="execution-controls">
                      <button 
                        className="control-btn" 
                        onClick={() => goToStep(0)}
                        title="Reset to beginning"
                      >
                        Reset
                      </button>
                      <button 
                        className="control-btn" 
                        onClick={stepBack}
                        disabled={!canStepBack}
                        title="Previous instruction"
                      >
                        Step Back
                      </button>
                      <div className="step-counter">
                        Step {currentIndex + 1} / {history.length}
                      </div>
                      <button 
                        className="control-btn primary" 
                        onClick={stepForward}
                        disabled={!canStepForward}
                        title="Next instruction"
                      >
                        Step Next
                      </button>
                    </div>
                  )}
                </header>
                <div className="panel-body">
                  <h3 className="section-subtitle">Value Stack</h3>
                  <ValueStack />
                </div>
              </section>

              <section className="panel-container glass-panel no-padding">
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
