/**
 * Page Layout Component
 * Wrapper for all pages with consistent spacing and animations
 */

import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

const PageLayout = ({ 
  children,
  title,
  showBackButton = false,
  onBack,
  headerActions,
  noPadding = false,
  noAnimation = false,
  className = '',
  ...props 
}) => {
  const content = (
    <div className={`min-h-screen bg-bg-primary ${className}`} {...props}>
      {/* Page Header */}
      {(title || showBackButton || headerActions) && (
        <div className="sticky top-16 md:top-0 z-20 bg-bg-primary/95 backdrop-blur-lg border-b border-white/10">
          <div className={`max-w-7xl mx-auto ${noPadding ? '' : 'px-4 sm:px-6'}`}>
            <div className="flex items-center justify-between h-14">
              {/* Left Side */}
              <div className="flex items-center gap-3">
                {/* Back Button */}
                {showBackButton && (
                  <button
                    onClick={onBack}
                    className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Title */}
                {title && (
                  <h1 className="text-xl md:text-2xl font-bold text-white">
                    {title}
                  </h1>
                )}
              </div>

              {/* Right Side - Header Actions */}
              {headerActions && (
                <div className="flex items-center gap-2">
                  {headerActions}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className={noPadding ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 py-6'}>
        {children}
      </div>

      {/* Bottom Spacing for Mobile Nav */}
      <div className="h-20 md:h-0" />
    </div>
  );

  // Wrap with animation if enabled
  if (noAnimation) {
    return content;
  }

  return (
    <motion.div {...pageTransition}>
      {content}
    </motion.div>
  );
};

export default PageLayout;