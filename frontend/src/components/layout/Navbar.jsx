import { Link, useNavigate } from 'react-router-dom';
import { IoSearch, IoNotifications } from 'react-icons/io5';
import { useAuth } from '@hooks/useAuth';
import { getInitials } from '@utils/helpers';

/**
 * Top Navbar Component (Desktop)
 */
export const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-dark-lighter border-b border-dark-light">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="text-3xl">🍳</div>
        <span className="text-2xl font-headline font-bold text-primary">
          Feastro
        </span>
      </Link>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative">
          <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray" size={20} />
          <input
            type="text"
            placeholder="Search recipes, ingredients..."
            onClick={() => navigate('/search')}
            className="w-full bg-dark-light border border-dark-lighter text-white placeholder-gray rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
            readOnly
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            {/* Notifications */}
            <button className="p-2 hover:bg-dark-light rounded-full transition-colors relative">
              <IoNotifications size={24} />
              {/* Notification Badge */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>

            {/* Profile */}
            <Link to="/profile" className="flex items-center gap-3 hover:bg-dark-light rounded-full px-3 py-2 transition-colors">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-headline font-bold">
                  {getInitials(user?.username)}
                </div>
              )}
              <span className="font-medium">{user?.username}</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="btn-secondary px-6 py-2">Login</button>
            </Link>
            <Link to="/register">
              <button className="btn-primary px-6 py-2">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};