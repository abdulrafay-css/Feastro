/**
 * Feed Progress Component
 * Shows current position in feed (X of Y)
 */

import { motion } from 'framer-motion';
import { fadeInDown } from '../../utils/animations';

const FeedProgress = ({ 
  current,
  total,
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      {...fadeInDown}
      className={`px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm font-medium ${className}`}
      {...props}
    >
      {current} / {total}
    </motion.div>
  );
};

export default FeedProgress;