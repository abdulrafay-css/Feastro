/**
 * Modal Dialog Component
 * Customizable modal with animations
 */

import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdrop, modalContent } from '../../utils/animations';
import { useEffect } from 'react';

const Modal = ({ 
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = '',
}) => {
  // Sizes
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full mx-4',
  };
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            {...modalBackdrop}
            onClick={closeOnBackdropClick ? onClose : undefined}
            className="fixed inset-0 bg-black/95 z-[1040] backdrop-blur-sm"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[1050] p-4 overflow-y-auto">
            <motion.div
              {...modalContent}
              className={`
                bg-bg-secondary rounded-2xl w-full ${sizes[size]}
                border border-white/10 shadow-2xl
                ${className}
              `}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                  {title && (
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                  )}
                  
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="text-white/50 hover:text-white transition-colors ml-auto"
                      aria-label="Close modal"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              
              {/* Content */}
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;