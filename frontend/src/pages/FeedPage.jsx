import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FeedContainer } from '@components/feed/FeedContainer';
import { useAuth } from '@hooks/useAuth';
import { Loader } from '@components/common/Loader';

/**
 * Feed Page - Main vertical scrolling feed
 */
export const FeedPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const [feedType, setFeedType] = useState('personalized'); // 'personalized' or 'discover'

  // Loading state
  if (loading) {
    return <Loader fullScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative">
      {/* Feed Type Toggle (Optional) */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="bg-dark-lighter bg-opacity-80 backdrop-blur-sm rounded-full p-1 flex gap-1">
          <button
            onClick={() => setFeedType('personalized')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              feedType === 'personalized'
                ? 'bg-primary text-white'
                : 'text-gray-light hover:text-white'
            }`}
          >
            For You
          </button>
          <button
            onClick={() => setFeedType('discover')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              feedType === 'discover'
                ? 'bg-primary text-white'
                : 'text-gray-light hover:text-white'
            }`}
          >
            Discover
          </button>
        </div>
      </div>

      {/* Feed Container */}
      <FeedContainer feedType={feedType} />
    </div>
  );
};