import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useEmulatorStore } from '../store/emulatorStore';
import { ValueCard } from './ValueStack/ValueCard';

/**
 * Visualize the YARV operand stack with animations.
 * Handles both the active stack during execution and the final return value
 * once execution completes.
 * 
 * Performance Note: We use stable slot-based keys to ensure that values 
 * updating at the same stack position are treated as content updates rather 
 * than mount/unmount cycles, significantly reducing animation lag.
 */
export function ValueStack() {
  const stack = useEmulatorStore((state) => state.activeStack());
  const currentIndex = useEmulatorStore((state) => state.currentIndex);
  const history = useEmulatorStore((state) => state.history);
  
  const currentState = history[currentIndex];
  const returnValue = currentState?.returnValue;

  // We consider the program finished if there are no more frames
  const isFinished = currentState && currentState.frames.length === 0;

  // We reverse the stack for visual display (top of stack at top of UI).
  const indexedStack = stack ? stack.map((val, i) => ({ val, originalIndex: i })).reverse() : [];

  return (
    <div className="value-stack-container">
      <LayoutGroup>
        <AnimatePresence mode="popLayout" initial={false}>
          {isFinished && returnValue ? (
            /* Program Finished: Show Return Value */
            /* We use a stable key for the first slot to ensure smooth transition from top-of-stack to result */
            <motion.div
              key="stack-slot-0"
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 600, damping: 35 }}
              className="value-card glass-panel result-card"
            >
              <div className="value-label">RESULT</div>
              <div className="value-type">{returnValue.type}</div>
              <div className="value-content highlight">{String(returnValue.value)}</div>
            </motion.div>
          ) : indexedStack.length > 0 ? (
            /* Executing: Show Stack */
            indexedStack.map((item, idx) => (
              <ValueCard 
                /* Stable key using ONLY the slot index. Content is animated internally. */
                key={`stack-slot-${item.originalIndex}`} 
                rubyObject={item.val} 
                index={idx} 
              />
            ))
          ) : (
            /* Empty State */
            <motion.div 
              key="empty"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="panel-info"
            >
              Stack is empty
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}
