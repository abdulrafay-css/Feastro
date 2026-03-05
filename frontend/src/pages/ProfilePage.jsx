import { useState, useEffect, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ProfileHeader } from '@components/profile/ProfileHeader';
import { ProfileTabs } from '@components/profile/ProfileTabs';
import { RecipeGrid } from '@components/profile/RecipeGrid';
import { useAuth } from '@hooks/useAuth';
import { useInfiniteScroll } from '@hooks/useInfiniteScroll';
import { userService } from '@services/userService';
import { recipeService } from '@services/recipeService';
import { Loader } from '@components/common/Loader';
import toast from 'react-hot-toast';

/**
 * Profile Page
 */
export const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('recipes');

  // Determine which username to fetch
  const profileUsername = username || currentUser?.username;

  // Tabs configuration
  const tabs = [
    { id: 'recipes', label: 'Recipes' },
    { id: 'saved', label: 'Saved' },
  ];

  /**
   * Fetch user profile
   */
  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileUsername) return;

      setLoading(true);
      setError(null);

      try {
        const profileData = await userService.getUserProfile(profileUsername);
        setProfile(profileData);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
        toast.error(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileUsername]);

  // Fetch recipes based on active tab
  const fetchRecipes = useCallback(
    async (page, pageSize) => {
      if (!profile) return [];

      if (activeTab === 'recipes') {
        const response = await userService.getUserRecipes(profile.id, page, pageSize);
        return response;
      } else if (activeTab === 'saved') {
        const response = await recipeService.getSavedRecipes(page, pageSize);
        return response;
      }

      return [];
    },
    [profile, activeTab]
  );

  // Infinite scroll hook
  const {
    data: recipes,
    loading: recipesLoading,
    error: recipesError,
    hasMore,
    refresh,
    observerRef,
  } = useInfiniteScroll(fetchRecipes, {
    pageSize: 12,
    enabled: !!profile,
  });

  // Refresh recipes when tab changes
  useEffect(() => {
    if (profile) {
      refresh();
    }
  }, [activeTab, profile]);

  /**
   * Handle follow change
   */
  const handleFollowChange = (isFollowing) => {
    setProfile((prev) => ({
      ...prev,
      is_following: isFollowing,
      followers_count: prev.followers_count + (isFollowing ? 1 : -1),
    }));
  };

  // Auth loading
  if (authLoading) {
    return <Loader fullScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Loading state
  if (loading) {
    return <Loader fullScreen />;
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-headline font-bold mb-2">Profile Not Found</h2>
        <p className="text-gray-light text-center mb-6">
          {error || 'This profile does not exist'}
        </p>
        <button
          onClick={() => window.history.back()}
          className="btn-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark pb-20 md:pb-0">
      {/* Profile Header */}
      <div className="bg-dark-lighter border-b border-dark-light">
        <div className="max-w-4xl mx-auto">
          <ProfileHeader profile={profile} onFollowChange={handleFollowChange} />
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto">
        <ProfileTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        <RecipeGrid
          recipes={recipes}
          loading={recipesLoading}
          error={recipesError}
          emptyMessage={
            activeTab === 'recipes'
              ? 'No recipes yet'
              : 'No saved recipes'
          }
        />

        {/* Infinite Scroll Observer */}
        {hasMore && <div ref={observerRef} className="h-20" />}
      </div>
    </div>
  );
};