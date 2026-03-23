/**
 * Profile Page
 * User profile with recipes, stats, and tabs
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import ProfileHeader from '../components/profile/ProfileHeader';
import StatsCard from '../components/profile/StatsCard';
import RecipeTabs from '../components/profile/RecipeTabs';
import FeedModal from '../components/feed/FeedModal';

const ProfilePage = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [myRecipes, setMyRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [feedModalOpen, setFeedModalOpen] = useState(false);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0);

  const isOwnProfile = !username; // If no username param, it's own profile

  useEffect(() => {
    fetchUser();
    fetchRecipes();
  }, [username]);

  const fetchUser = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: 'user-1',
        name: 'John Doe',
        username: username || 'johndoe',
        avatar: 'https://i.pravatar.cc/150?img=1',
        bio: 'Home chef 👨‍🍳 | Sharing my favorite recipes | Food lover 🍕',
        verified: true,
        cover_image: 'https://picsum.photos/seed/profile/1200/400',
        stats: {
          recipes: 42,
          followers: 12500,
          following: 350,
          likes: 45000,
        },
        social_links: {
          website: 'https://example.com',
          instagram: 'johndoe',
          youtube: 'https://youtube.com/@johndoe',
        },
      };
      setUser(mockUser);
      setLoading(false);
    }, 800);
  };

  const fetchRecipes = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockMyRecipes = Array(8).fill(0).map((_, i) => ({
        id: `my-recipe-${i}`,
        title: `My Recipe ${i + 1}`,
        thumbnail: `https://picsum.photos/seed/my${i}/400/600`,
        creator: user,
        cooking_time: 30,
        difficulty: 'medium',
        likes_count: 1000,
        saves_count: 500,
        views_count: 5000,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      }));

      const mockLiked = Array(12).fill(0).map((_, i) => ({
        id: `liked-${i}`,
        title: `Liked Recipe ${i + 1}`,
        thumbnail: `https://picsum.photos/seed/liked${i}/400/600`,
        creator: {
          name: `Chef ${i + 1}`,
          username: `chef${i + 1}`,
          avatar: `https://i.pravatar.cc/150?img=${i + 60}`,
        },
        cooking_time: 30,
        difficulty: 'easy',
        likes_count: 2000,
        is_liked: true,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      }));

      const mockSaved = Array(10).fill(0).map((_, i) => ({
        id: `profile-saved-${i}`,
        title: `Saved Recipe ${i + 1}`,
        thumbnail: `https://picsum.photos/seed/psaved${i}/400/600`,
        creator: {
          name: `Creator ${i + 1}`,
          username: `creator${i + 1}`,
          avatar: `https://i.pravatar.cc/150?img=${i + 70}`,
        },
        cooking_time: 25,
        difficulty: 'hard',
        saves_count: 800,
        is_saved: true,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      }));

      setMyRecipes(mockMyRecipes);
      setLikedRecipes(mockLiked);
      setSavedRecipes(mockSaved);
    }, 1000);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleEdit = () => {
    // Navigate to edit profile
    console.log('Edit profile');
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/profile/${user?.username}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.name} on Feastro`,
          url,
        });
      } catch (err) {
        console.error('Share failed');
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Profile link copied!');
    }
  };

  const handleRecipeClick = (recipe) => {
    const allRecipes = [...myRecipes, ...likedRecipes, ...savedRecipes];
    const index = allRecipes.findIndex(r => r.id === recipe.id);
    setSelectedRecipeIndex(index);
    setFeedModalOpen(true);
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-white/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageLayout noPadding noAnimation>
      <div className="space-y-6">
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onEdit={handleEdit}
          onShare={handleShare}
        />

        {/* Stats Cards (Own Profile Only) */}
        {isOwnProfile && (
          <div className="px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              label="Total Views"
              value={user.stats.likes}
              icon="👁️"
              trend={12}
              color="blue"
            />
            <StatsCard
              label="Total Likes"
              value={user.stats.likes}
              icon="❤️"
              trend={8}
              color="orange"
            />
            <StatsCard
              label="Engagement"
              value={15.5}
              icon="📊"
              trend={-3}
              color="purple"
            />
            <StatsCard
              label="New Followers"
              value={234}
              icon="👥"
              trend={25}
              color="green"
            />
          </div>
        )}

        {/* Recipe Tabs */}
        <div className="px-6">
          <RecipeTabs
            myRecipes={myRecipes}
            likedRecipes={likedRecipes}
            savedRecipes={savedRecipes}
            onRecipeClick={handleRecipeClick}
            loading={false}
          />
        </div>
      </div>

      {/* Feed Modal */}
      <FeedModal
        isOpen={feedModalOpen}
        onClose={() => setFeedModalOpen(false)}
        initialRecipes={[...myRecipes, ...likedRecipes, ...savedRecipes]}
        initialIndex={selectedRecipeIndex}
      />
    </PageLayout>
  );
};

export default ProfilePage;