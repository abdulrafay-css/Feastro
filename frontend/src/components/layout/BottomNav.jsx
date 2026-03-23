/**
 * Bottom Navigation Component
 * Mobile bottom navigation bar
 */

import { motion } from 'framer-motion';

const BottomNav = ({ 
  activeTab = 'home',
  onTabChange,
  className = '',
  ...props 
}) => {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'search',
      label: 'Search',
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: 'feed',
      label: 'Feed',
      icon: (active) => (
        <div className="relative">
          <svg className="w-7 h-7" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
      special: true, // Highlighted center button
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-30 bg-bg-secondary/95 backdrop-blur-lg border-t border-white/10 pb-safe ${className}`} {...props}>
      <div className="max-w-lg mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`
                  relative flex flex-col items-center justify-center gap-1
                  transition-all duration-200
                  ${tab.special ? '-mt-8' : ''}
                  ${isActive && !tab.special ? 'opacity-100' : 'opacity-60 hover:opacity-80'}
                `}
              >
                {/* Special Feed Button */}
                {tab.special ? (
                  <div className={`
                    w-14 h-14 rounded-full flex items-center justify-center
                    shadow-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-500/50 scale-110' 
                      : 'bg-gradient-to-r from-orange-500/80 to-orange-600/80 shadow-orange-500/30'
                    }
                  `}>
                    <span className="text-white">
                      {tab.icon(isActive)}
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Regular Button Icon */}
                    <span className={isActive ? 'text-orange-400' : 'text-white'}>
                      {tab.icon(isActive)}
                    </span>

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="bottomNavIndicator"
                        className="w-1 h-1 bg-orange-500 rounded-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}

                {/* Label */}
                {!tab.special && (
                  <span className={`text-xs ${isActive ? 'text-orange-400 font-medium' : 'text-white'}`}>
                    {tab.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;