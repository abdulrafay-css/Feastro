import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { FeedContainer } from './FeedContainer';

/**
 * Feed Modal - Full-screen reel feed
 */
export const FeedModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-50 bg-dark"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-3 bg-dark bg-opacity-80 backdrop-blur-sm rounded-full hover:bg-opacity-100 transition-all safe-top"
          >
            <IoClose size={24} />
          </button>

          {/* Feed Container */}
          <FeedContainer feedType="discover" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};