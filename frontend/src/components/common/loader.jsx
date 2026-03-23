/**
 * Loader Component
 * Loading spinners and indicators
 */

import { motion } from 'framer-motion';

const Loader = ({ 
  type = 'spinner',
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  
  // Spinner Loader
  if (type === 'spinner') {
    return (
      <motion.div
        className={`${sizes[size]} border-4 border-white/20 border-t-orange-500 rounded-full ${className}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        {...props}
      />
    );
  }
  
  // Dots Loader
  if (type === 'dots') {
    return (
      <div className={`flex gap-2 ${className}`} {...props}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-orange-500 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    );
  }
  
  // Pulse Loader
  if (type === 'pulse') {
    return (
      <motion.div
        className={`${sizes[size]} bg-orange-500 rounded-full ${className}`}
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        {...props}
      />
    );
  }
  
  return null;
};

export default Loader;