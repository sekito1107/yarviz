import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <motion.div 
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div 
        className="gem-icon"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.5,
          opacity: { duration: 1 }
        }}
      />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{ textAlign: 'center' }}
      >
        <p className="loading-text">Initializing Ruby 4.0.2 Environment...</p>
        <p className="loading-sub-text">Powering up YARV engine</p>
      </motion.div>
    </motion.div>
  );
}
