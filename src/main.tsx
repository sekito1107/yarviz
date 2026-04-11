import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Atomic Style Modules (Cascading order from Base to Components)
import './styles/tokens.css';
import './styles/base.css';
import './styles/animations.css';
import './styles/layout.css';
import './styles/panels.css';
import './styles/loading.css';
import './styles/editor.css';
import './styles/instructions.css';
import './styles/stack.css';
import './styles/controls.css';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
