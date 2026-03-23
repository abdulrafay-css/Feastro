/**
 * Engagement Buttons Component
 * Like, Save, Share, Comment buttons for feed
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { successPop } from '../../utils/animations';
import { formatNumber } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

const EngagementButtons = ({ 
  recipe,
  className = '',
  ...props 
}) => {
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(recipe.is_liked || false);
  const [isSaved, setIsSaved] = useState(recipe.is_saved || false);
  const [likesCount, setLikesCount] = useState(recipe.likes_count || 0);
  const [savesCount, setSavesCount] = useState(recipe.saves_count || 0);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    showToast(isLiked ? 'Removed from likes' : 'Liked! ❤️', 'success');
    
    // Call API
    // await toggleLike(recipe.id);
  };

  const handleSave = async () => {
    setIsSaved(!isSaved);
    setSavesCount(prev => isSaved ? prev - 1 : prev + 1);
    showToast(isSaved ? 'Removed from saved' : 'Saved! 🔖', 'success');
    
    // Call API
    // await toggleSave(recipe.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this recipe: ${recipe.title}`,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  const handleComment = () => {
    showToast('Comments coming soon!', 'info');
  };

  const buttons = [
    {
      id: 'like',
      icon: isLiked ? (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      count: likesCount,
      onClick: handleLike,
      color: isLiked ? 'text-red-500' : 'text-white',
    },
    {
      id: 'comment',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      count: recipe.comments_count || 0,
      onClick: handleComment,
      color: 'text-white',
    },
    {
      id: 'save',
      icon: isSaved ? (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      ) : (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
      count: savesCount,
      onClick: handleSave,
      color: isSaved ? 'text-orange-500' : 'text-white',
    },
    {
      id: 'share',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      ),
      count: recipe.shares_count || 0,
      onClick: handleShare,
      color: 'text-white',
    },
  ];

  return (
    <div className={`flex flex-col gap-6 ${className}`} {...props}>
      {buttons.map((button) => (
        <motion.button
          key={button.id}
          whileTap={{ scale: 0.9 }}
          onClick={button.onClick}
          className="flex flex-col items-center gap-1 group"
        >
          <motion.div
            className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center ${button.color} group-hover:bg-white/20 transition-all`}
            {...(button.id === 'like' && isLiked ? successPop : {})}
          >
            {button.icon}
          </motion.div>
          
          {button.count > 0 && (
            <span className="text-white text-xs font-medium">
              {formatNumber(button.count)}
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default EngagementButtons;