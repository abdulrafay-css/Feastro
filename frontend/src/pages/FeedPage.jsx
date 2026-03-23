/**
 * Feed Page
 * Full-screen video feed (similar to TikTok)
 */

import { useState, useEffect } from 'react';
import FeedModal from '../components/feed/FeedModal';

const FeedPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockRecipes = Array(20).fill(0).map((_, i) => ({
        id: `feed-recipe-${i}`,
        title: `Amazing Recipe ${i + 1}`,
        description: 'A delicious recipe that will blow your mind!',
        thumbnail: `https://picsum.photos/seed/feed${i}/400/600`,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        creator: {
          name: `Creator ${i + 1}`,
          username: `creator${i + 1}`,
          avatar: `https://i.pravatar.cc/150?img=${i + 20}`,
        },
        cooking_time: 25 + (i * 5),
        difficulty: ['easy', 'medium', 'hard'][i % 3],
        servings: 4,
        likes_count: 2000 + (i * 200),
        saves_count: 800 + (i * 80),
        comments_count: 150 + (i * 15),
        shares_count: 50 + (i * 5),
        is_liked: i % 5 === 0,
        is_saved: i % 6 === 0,
        ingredients: [
          { name: 'Ingredient 1', amount: 2, unit: 'cups' },
          { name: 'Ingredient 2', amount: 1, unit: 'tbsp' },
          { name: 'Ingredient 3', amount: 3, unit: '' },
        ],
        instructions: [
          { text: 'Step 1: Prepare ingredients' },
          { text: 'Step 2: Mix everything together' },
          { text: 'Step 3: Cook until done' },
          { text: 'Step 4: Serve and enjoy!' },
        ],
        tags: ['quick', 'easy', 'healthy'],
      }));
      setRecipes(mockRecipes);
      setLoading(false);
    }, 1000);
  };

  const handleLoadMore = async () => {
    // Load more recipes
    const newRecipes = Array(10).fill(0).map((_, i) => ({
      id: `feed-recipe-new-${i}`,
      title: `New Recipe ${i + 1}`,
      thumbnail: `https://picsum.photos/seed/new${i}/400/600`,
      video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      creator: {
        name: `New Creator ${i + 1}`,
        username: `newcreator${i + 1}`,
        avatar: `https://i.pravatar.cc/150?img=${i + 30}`,
      },
      cooking_time: 30,
      difficulty: 'medium',
      likes_count: 1000,
      saves_count: 500,
    }));
    return newRecipes;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-bg-primary flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <FeedModal
      isOpen={true}
      onClose={() => window.history.back()}
      initialRecipes={recipes}
      initialIndex={0}
      onLoadMore={handleLoadMore}
    />
  );
};

export default FeedPage;