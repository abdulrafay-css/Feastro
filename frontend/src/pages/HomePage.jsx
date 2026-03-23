/**
 * Home Page
 * Main landing page with personalized recipe feed
 */

import { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import CategoryNav from '../components/home/CategoryNav';
import PersonalizedSection from '../components/home/PersonalizedSection';
import RecipeGrid from '../components/home/RecipeGrid';
import TrendingSection from '../components/home/TrendingSection';
import FeedModal from '../components/feed/FeedModal';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [recipes, setRecipes] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedModalOpen, setFeedModalOpen] = useState(false);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0);

  // Mock data - replace with API calls
  useEffect(() => {
    fetchRecipes();
    fetchTrending();
  }, [selectedCategory]);

  const fetchRecipes = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockRecipes = Array(12).fill(0).map((_, i) => ({
        id: `recipe-${i}`,
        title: `Delicious Recipe ${i + 1}`,
        thumbnail: `https://picsum.photos/seed/${i}/400/600`,
        creator: {
          name: `Chef ${i + 1}`,
          username: `chef${i + 1}`,
          avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
        },
        cooking_time: 30 + (i * 5),
        difficulty: ['easy', 'medium', 'hard'][i % 3],
        likes_count: 1000 + (i * 100),
        saves_count: 500 + (i * 50),
        views_count: 5000 + (i * 500),
        is_liked: i % 3 === 0,
        is_saved: i % 4 === 0,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      }));
      setRecipes(mockRecipes);
      setLoading(false);
    }, 1000);
  };

  const fetchTrending = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockTrending = Array(5).fill(0).map((_, i) => ({
        id: `trending-${i}`,
        title: `Trending Recipe ${i + 1}`,
        thumbnail: `https://picsum.photos/seed/trending${i}/400/600`,
        creator: {
          name: `Popular Chef ${i + 1}`,
          username: `popchef${i + 1}`,
          avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
        },
        cooking_time: 20 + (i * 10),
        difficulty: 'medium',
        likes_count: 5000 + (i * 1000),
        saves_count: 2000 + (i * 500),
        views_count: 50000 + (i * 10000),
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      }));
      setTrendingRecipes(mockTrending);
    }, 800);
  };

  const handleRecipeClick = (recipe) => {
    const index = recipes.findIndex(r => r.id === recipe.id);
    setSelectedRecipeIndex(index);
    setFeedModalOpen(true);
  };

  const handleTrendingClick = (recipe) => {
    const index = recipes.findIndex(r => r.id === recipe.id);
    setSelectedRecipeIndex(index >= 0 ? index : 0);
    setFeedModalOpen(true);
  };

  const handleLike = async (recipe) => {
    // API call to like recipe
    console.log('Liked:', recipe);
  };

  const handleSave = async (recipe) => {
    // API call to save recipe
    console.log('Saved:', recipe);
  };

  const handleLoadMore = async () => {
    // Load more recipes for feed
    return recipes.slice(0, 5); // Mock
  };

  return (
    <PageLayout noPadding noAnimation>
      <div className="space-y-6">
        {/* Category Navigation */}
        <CategoryNav
          onCategoryChange={setSelectedCategory}
          initialCategory={selectedCategory}
        />

        <div className="px-4 space-y-8">
          {/* Trending Section */}
          <PersonalizedSection
            title="Trending Now"
            subtitle="Most popular recipes this week"
            icon="🔥"
          >
            <TrendingSection
              recipes={trendingRecipes}
              loading={loading}
              onRecipeClick={handleTrendingClick}
              onLike={handleLike}
              onSave={handleSave}
            />
          </PersonalizedSection>

          {/* For You Section */}
          <PersonalizedSection
            title="For You"
            subtitle="Personalized based on your preferences"
            icon="✨"
          >
            <RecipeGrid
              recipes={recipes}
              loading={loading}
              onRecipeClick={handleRecipeClick}
              onLike={handleLike}
              onSave={handleSave}
            />
          </PersonalizedSection>
        </div>
      </div>

      {/* Feed Modal */}
      <FeedModal
        isOpen={feedModalOpen}
        onClose={() => setFeedModalOpen(false)}
        initialRecipes={recipes}
        initialIndex={selectedRecipeIndex}
        onLoadMore={handleLoadMore}
      />
    </PageLayout>
  );
};

export default HomePage;