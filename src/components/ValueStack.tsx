import { motion, AnimatePresence } from 'framer-motion';
import { useEmulatorStore } from '../store/emulatorStore';
import { ValueCard } from './ValueStack/ValueCard';

/**
 * Visualize the YARV operand stack with animations.
 */
export function ValueStack() {
  const stack = useEmulatorStore((state) => state.activeStack());

  if (!stack) {
    return (
      <div className="empty-stack-message">
        <p>No active execution frame.</p>
      </div>
    );
  }

  const reversedRubyObjects = [...stack].reverse();

  return (
    <div className="value-stack-container">
      <AnimatePresence mode="popLayout" initial={false}>
        {reversedRubyObjects.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="panel-info"
          >
            Stack is empty
          </motion.div>
        ) : (
          reversedRubyObjects.map((rubyObject, idx) => (
            <ValueCard 
              key={`${reversedRubyObjects.length - 1 - idx}-${rubyObject.type}-${rubyObject.value}`} 
              rubyObject={rubyObject} 
              index={idx} 
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
