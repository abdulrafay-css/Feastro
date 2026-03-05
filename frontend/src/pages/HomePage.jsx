import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { IoFlame, IoSearch } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { useAuth } from '@hooks/useAuth';
import { recipeService } from '@services/recipeService';
import { Loader } from '@components/common/Loader';
import { RecipeCard } from '@components/home/RecipeCard';
import { CategoryChips } from '@components/home/CategoryChips';
import { formatNumber, getInitials } from '@utils/helpers';

/**
 * Redesigned Home Page - Recipe Discovery
 */
export const HomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('trending');

  const categories = [
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
    { id: 'vegan', label: 'Vegan', icon: '🥗' },
    { id: 'lunch', label: 'Lunch', icon: '🍱' },
    { id: 'dinner', label: 'Dinner', icon: '🍽️' },
  ];

  /**
   * Fetch recommended recipes
   */
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        
        // Fetch personalized recommendations
        const recommended = await recipeService.getPersonalizedFeed(1, 6);
        setRecommendedRecipes(recommended.recipes || recommended);
        
        // Fetch trending recipes
        const trending = await recipeService.getTrendingRecipes(10);
        setTrendingRecipes(trending);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchRecipes();
    }
  }, [isAuthenticated]);

  // Auth loading
  if (authLoading) {
    return <Loader fullScreen />;
  }

  // Redirect to landing if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-dark pb-20">
      {/* Header */}
      <div className="px-4 pt-8 pb-4 safe-top">
        {/* Greeting */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-light mb-1">{getGreeting()},</p>
            <h1 className="text-4xl font-headline font-bold flex items-center gap-2">
              {user?.username || 'Chef'} <span className="text-3xl">👋</span>
            </h1>
          </div>

          {/* Avatar */}
          <button
            onClick={() => navigate('/profile')}
            className="flex-shrink-0"
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-xl font-headline font-bold">
                {getInitials(user?.username)}
              </div>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/search')}
            className="flex-1 flex items-center gap-3 bg-dark-light border border-dark-lighter rounded-2xl px-4 py-4"
          >
            <IoSearch size={20} className="text-gray" />
            <span className="text-gray">What are you craving?</span>
          </button>

          <button
            onClick={() => navigate('/search')}
            className="bg-dark-light border border-dark-lighter rounded-2xl p-4"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-gray"
            >
              <path
                d="M2 6h16M2 10h10M2 14h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Category Chips */}
        <CategoryChips
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="large" />
        </div>
      ) : (
        <>
          {/* Recommended Section */}
          <div className="px-4 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-headline font-bold mb-1">
                  Recommended for You
                </h2>
                <p className="text-sm text-gray-light">
                  Based on your recent likes
                </p>
              </div>
              <button
                onClick={() => navigate('/search')}
                className="text-primary hover:text-primary-light font-semibold flex items-center gap-1"
              >
                See All
                <span>→</span>
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {recommendedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} variant="horizontal" />
              ))}
            </div>
          </div>

          {/* Trending Section */}
          <div className="px-4">
            <h2 className="text-2xl font-headline font-bold mb-4">
              Trending Near You
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {trendingRecipes.slice(0, 4).map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} variant="large" />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};