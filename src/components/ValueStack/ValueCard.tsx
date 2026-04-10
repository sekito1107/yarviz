import { motion, AnimatePresence } from 'framer-motion';
import type { RubyValue } from '../../core/types/ruby_value';

interface ValueCardProps {
  rubyObject: RubyValue;
  index: number;
}

/**
 * High-performance spring configuration.
 * Using higher stiffness for instant feedback, reducing 'lag' feel.
 */
const fastSpringConfig = {
  type: "spring",
  stiffness: 800,
  damping: 45,
  mass: 1
} as const;

/**
 * Internal transition for content changes.
 * Provides a subtle cross-fade when the value changes inside a stable slot.
 */
const contentTransition = {
  duration: 0.15,
  ease: "easeOut"
} as const;

/**
 * Renders an individual value in the stack with a premium glassmorphic look.
 * Optimized for speed and visual continuity during rapid stepping.
 */
export function ValueCard({ rubyObject, index }: ValueCardProps) {

  const isLast = index === 0;
  const valueKey = `${rubyObject.type}-${rubyObject.value}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02, y: 5 }}
      transition={fastSpringConfig}
      className={`value-card glass-panel ${isLast ? 'active' : ''}`}
    >
      <div className="value-type">{rubyObject.type}</div>
      
      {/* 
        Internal AnimatePresence triggers a subtle fade/slide 
        whenever the value changes but the card (slot) remains the same.
      */}
      <div className="value-content-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={valueKey}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 5 }}
            transition={contentTransition}
            className="value-content"
          >
            {String(rubyObject.value)}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
