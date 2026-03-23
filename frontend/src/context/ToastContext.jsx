/**
 * Toast Notification Context
 * Global toast notification system with animations
 * 
 * Usage:
 * import { useToast } from '@/context/ToastContext';
 * 
 * const { showToast } = useToast();
 * showToast('Success!', 'success');
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { successPop } from '../utils/animations';

// Create Context
const ToastContext = createContext();

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {string} type - Toast type ('success', 'error', 'warning', 'info')
   * @param {number} duration - Duration in milliseconds (default: 3000)
   */
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  /**
   * Manually dismiss a toast
   * @param {number} id - Toast ID to dismiss
   */
  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  /**
   * Clear all toasts
   */
  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  /**
   * Get toast styles based on type
   */
  const getToastStyles = (type) => {
    const styles = {
      success: {
        bg: 'bg-green-500/90',
        text: 'text-white',
        icon: '✓',
      },
      error: {
        bg: 'bg-red-500/90',
        text: 'text-white',
        icon: '✕',
      },
      warning: {
        bg: 'bg-yellow-500/90',
        text: 'text-black',
        icon: '⚠',
      },
      info: {
        bg: 'bg-blue-500/90',
        text: 'text-white',
        icon: 'ℹ',
      },
    };
    return styles[type] || styles.success;
  };

  const value = {
    showToast,
    dismissToast,
    clearAllToasts,
    toasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[1080] flex flex-col gap-2 pointer-events-none max-w-md w-full px-4">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => {
            const style = getToastStyles(toast.type);
            
            return (
              <motion.div
                key={toast.id}
                {...successPop}
                layout
                className={`
                  ${style.bg} ${style.text}
                  px-6 py-3 rounded-full shadow-2xl backdrop-blur-md
                  pointer-events-auto
                  flex items-center gap-3
                  w-full justify-center
                `}
                onClick={() => dismissToast(toast.id)}
              >
                {/* Icon */}
                <span className="text-lg font-bold">{style.icon}</span>
                
                {/* Message */}
                <p className="font-medium text-sm flex-1 text-center">
                  {toast.message}
                </p>
                
                {/* Close button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissToast(toast.id);
                  }}
                  className="text-current opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Export default
export default ToastContext;