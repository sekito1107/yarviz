import { motion } from 'framer-motion';
import type { RubyValue } from '../../core/types/ruby_value';

interface ValueCardProps {
  rubyObject: RubyValue;
  index: number;
}

/**
 * Renders an individual value in the stack with a premium glassmorphic look.
 * This is an internal component for ValueStack.
 */
export function ValueCard({ rubyObject, index }: ValueCardProps) {

  const isLast = index === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`value-card glass-panel ${isLast ? 'active' : ''}`}
    >
      <div className="value-type">{rubyObject.type}</div>
      <div className="value-content">{String(rubyObject.value)}</div>
    </motion.div>
  );
}
