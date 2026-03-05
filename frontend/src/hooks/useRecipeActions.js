import { useState, useCallback } from 'react';
import { recipeService } from '@services/recipeService';
import toast from 'react-hot-toast';
import { SUCCESS_MESSAGES } from '@utils/constants';

/**
 * Custom hook for recipe engagement actions
 */
export const useRecipeActions = (recipeId, initialState = {}) => {
  const [isLiked, setIsLiked] = useState(initialState.isLiked || false);
  const [isSaved, setIsSaved] = useState(initialState.isSaved || false);
  const [likesCount, setLikesCount] = useState(initialState.likesCount || 0);
  const [savesCount, setSavesCount] = useState(initialState.savesCount || 0);
  const [loading, setLoading] = useState(false);

  /**
   * Like recipe
   */
  const likeRecipe = useCallback(async () => {
    if (loading) return;

    // Optimistic update
    const previousState = { isLiked, likesCount };
    setIsLiked(true);
    setLikesCount((prev) => prev + 1);

    setLoading(true);

    try {
      await recipeService.likeRecipe(recipeId);
      toast.success(SUCCESS_MESSAGES.RECIPE_LIKED);
    } catch (error) {
      // Revert on error
      setIsLiked(previousState.isLiked);
      setLikesCount(previousState.likesCount);
      toast.error(error.message || 'Failed to like recipe');
    } finally {
      setLoading(false);
    }
  }, [recipeId, isLiked, likesCount, loading]);

  /**
   * Unlike recipe
   */
  const unlikeRecipe = useCallback(async () => {
    if (loading) return;

    // Optimistic update
    const previousState = { isLiked, likesCount };
    setIsLiked(false);
    setLikesCount((prev) => Math.max(0, prev - 1));

    setLoading(true);

    try {
      await recipeService.unlikeRecipe(recipeId);
    } catch (error) {
      // Revert on error
      setIsLiked(previousState.isLiked);
      setLikesCount(previousState.likesCount);
      toast.error(error.message || 'Failed to unlike recipe');
    } finally {
      setLoading(false);
    }
  }, [recipeId, isLiked, likesCount, loading]);

  /**
   * Toggle like
   */
  const toggleLike = useCallback(() => {
    if (isLiked) {
      unlikeRecipe();
    } else {
      likeRecipe();
    }
  }, [isLiked, likeRecipe, unlikeRecipe]);

  /**
   * Save recipe
   */
  const saveRecipe = useCallback(async () => {
    if (loading) return;

    // Optimistic update
    const previousState = { isSaved, savesCount };
    setIsSaved(true);
    setSavesCount((prev) => prev + 1);

    setLoading(true);

    try {
      await recipeService.saveRecipe(recipeId);
      toast.success(SUCCESS_MESSAGES.RECIPE_SAVED);
    } catch (error) {
      // Revert on error
      setIsSaved(previousState.isSaved);
      setSavesCount(previousState.savesCount);
      toast.error(error.message || 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  }, [recipeId, isSaved, savesCount, loading]);

  /**
   * Unsave recipe
   */
  const unsaveRecipe = useCallback(async () => {
    if (loading) return;

    // Optimistic update
    const previousState = { isSaved, savesCount };
    setIsSaved(false);
    setSavesCount((prev) => Math.max(0, prev - 1));

    setLoading(true);

    try {
      await recipeService.unsaveRecipe(recipeId);
      toast.success('Recipe removed from saved');
    } catch (error) {
      // Revert on error
      setIsSaved(previousState.isSaved);
      setSavesCount(previousState.savesCount);
      toast.error(error.message || 'Failed to unsave recipe');
    } finally {
      setLoading(false);
    }
  }, [recipeId, isSaved, savesCount, loading]);

  /**
   * Toggle save
   */
  const toggleSave = useCallback(() => {
    if (isSaved) {
      unsaveRecipe();
    } else {
      saveRecipe();
    }
  }, [isSaved, saveRecipe, unsaveRecipe]);

  /**
   * Log engagement
   */
  const logEngagement = useCallback(
    async (engagementType, data = {}) => {
      try {
        await recipeService.logEngagement({
          recipe_id: recipeId,
          engagement_type: engagementType,
          ...data,
        });
      } catch (error) {
        console.error('Failed to log engagement:', error);
      }
    },
    [recipeId]
  );

  /**
   * Share recipe
   */
  const shareRecipe = useCallback(async () => {
    try {
      const shareUrl = `${window.location.origin}/recipe/${recipeId}`;

      if (navigator.share) {
        await navigator.share({
          title: 'Check out this recipe on Feastro',
          url: shareUrl,
        });
        
        // Log share engagement
        await logEngagement('share');
        toast.success('Recipe shared!');
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error('Failed to share recipe');
      }
    }
  }, [recipeId, logEngagement]);

  return {
    isLiked,
    isSaved,
    likesCount,
    savesCount,
    loading,
    toggleLike,
    toggleSave,
    shareRecipe,
    logEngagement,
  };
};