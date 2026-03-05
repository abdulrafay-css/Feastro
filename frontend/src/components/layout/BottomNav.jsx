import { Link, useLocation } from 'react-router-dom';
import { IoHome, IoSearch, IoBookmark, IoPerson } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@hooks/useAuth';
import { useState } from 'react';
import { FeedModal } from '@components/feed/FeedModal';

/**
 * Bottom Navigation Component (Mobile) - REDESIGNED
 */
export const BottomNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [showFeedModal, setShowFeedModal] = useState(false);

  const navItems = [
    { id: 'home', icon: IoHome, label: 'Home', path: '/' },
    { id: 'search', icon: IoSearch, label: 'Search', path: '/search' },
    { id: 'feed', label: 'Feed', special: true }, // Special + button
    { id: 'saved', icon: IoBookmark, label: 'Saved', path: '/saved' },
    { id: 'profile', icon: IoPerson, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-lighter border-t border-dark-light safe-bottom z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            // Special + button for feed
            if (item.special) {
              return (
                <button
                  key={item.id}
                  onClick={() => setShowFeedModal(true)}
                  className="relative -mt-8 no-tap-highlight"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/50"
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-white"
                    >
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.div>
                </button>
              );
            }

            // Regular nav items
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                className="relative flex flex-col items-center justify-center flex-1 py-2 no-tap-highlight"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`transition-colors ${
                    active ? 'text-primary' : 'text-gray-light'
                  }`}
                >
                  <Icon size={24} />
                </motion.div>

                {/* Label */}
                <span
                  className={`text-xs mt-1 font-medium ${
                    active ? 'text-primary' : 'text-gray-light'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Feed Modal */}
      <FeedModal isOpen={showFeedModal} onClose={() => setShowFeedModal(false)} />
    </>
  );
};