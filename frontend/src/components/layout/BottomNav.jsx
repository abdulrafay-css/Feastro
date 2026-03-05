import { Link, useLocation } from 'react-router-dom';
import { IoHome, IoSearch, IoAddCircle, IoBookmark, IoPerson } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { useAuth } from '@hooks/useAuth';

/**
 * Bottom Navigation Component (Mobile)
 */
export const BottomNav = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const navItems = [
    { id: 'home', icon: IoHome, label: 'Home', path: '/feed' },
    { id: 'search', icon: IoSearch, label: 'Search', path: '/search' },
    { id: 'create', icon: IoAddCircle, label: 'Create', path: '/create', size: 32 },
    { id: 'saved', icon: IoBookmark, label: 'Saved', path: '/saved' },
    { id: 'profile', icon: IoPerson, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-lighter border-t border-dark-light safe-bottom z-40">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const iconSize = item.size || 24;

          return (
            <Link
              key={item.id}
              to={item.path}
              className="relative flex flex-col items-center justify-center flex-1 py-2 no-tap-highlight"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full transition-colors ${
                  active ? 'text-primary' : 'text-gray-light'
                }`}
              >
                <Icon size={iconSize} />
              </motion.div>

              {/* Active Indicator */}
              {active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-0.5 w-1 h-1 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};