import { motion } from 'framer-motion';
import { IoHeart, IoHeartOutline, IoBookmark, IoBookmarkOutline, IoShareSocial } from 'react-icons/io5';
import { useRecipeActions } from '@hooks/useRecipeActions';
import { formatNumber } from '@utils/helpers';

/**
 * Engagement Buttons Component - Like, Save, Share buttons
 */
export const EngagementButtons = ({ recipe }) => {
  const {
    isLiked,
    isSaved,
    likesCount,
    savesCount,
    toggleLike,
    toggleSave,
    shareRecipe,
  } = useRecipeActions(recipe.id, {
    isLiked: recipe.is_liked,
    isSaved: recipe.is_saved,
    likesCount: recipe.likes_count,
    savesCount: recipe.saves_count,
  });

  const buttonVariants = {
    tap: { scale: 0.85 },
    hover: { scale: 1.1 },
  };

  return (
    <div className="absolute right-4 bottom-24 z-10 flex flex-col gap-6">
      {/* Like Button */}
      <motion.button
        variants={buttonVariants}
        whileTap="tap"
        whileHover="hover"
        onClick={toggleLike}
        className="flex flex-col items-center gap-1 no-tap-highlight"
      >
        <div className="bg-dark bg-opacity-50 backdrop-blur-sm p-3 rounded-full">
          {isLiked ? (
            <IoHeart className="text-3xl text-red-500" />
          ) : (
            <IoHeartOutline className="text-3xl text-white" />
          )}
        </div>
        <span className="text-xs font-semibold">{formatNumber(likesCount)}</span>
      </motion.button>

      {/* Save Button */}
      <motion.button
        variants={buttonVariants}
        whileTap="tap"
        whileHover="hover"
        onClick={toggleSave}
        className="flex flex-col items-center gap-1 no-tap-highlight"
      >
        <div className="bg-dark bg-opacity-50 backdrop-blur-sm p-3 rounded-full">
          {isSaved ? (
            <IoBookmark className="text-3xl text-accent" />
          ) : (
            <IoBookmarkOutline className="text-3xl text-white" />
          )}
        </div>
        <span className="text-xs font-semibold">{formatNumber(savesCount)}</span>
      </motion.button>

      {/* Share Button */}
      <motion.button
        variants={buttonVariants}
        whileTap="tap"
        whileHover="hover"
        onClick={shareRecipe}
        className="flex flex-col items-center gap-1 no-tap-highlight"
      >
        <div className="bg-dark bg-opacity-50 backdrop-blur-sm p-3 rounded-full">
          <IoShareSocial className="text-3xl text-white" />
        </div>
        <span className="text-xs font-semibold">Share</span>
      </motion.button>
    </div>
  );
};