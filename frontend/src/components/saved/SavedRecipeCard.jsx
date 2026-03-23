/**
 * Saved Recipe Card Component
 * Recipe card with collection management options
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hoverLift, staggerItem, scaleIn } from '../../utils/animations';
import { formatNumber, formatTime, getDifficultyColor } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import Button from '../common/Button';

const SavedRecipeCard = ({ 
  recipe,
  collections = [],
  onClick,
  onRemove,
  onMoveToCollection,
  className = '',
  ...props 
}) => {
  const { showToast } = useToast();
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove?.(recipe);
    showToast('Removed from saved recipes', 'success');
  };

  const handleMove = () => {
    if (selectedCollection) {
      onMoveToCollection?.(recipe, selectedCollection);
      showToast(`Moved to ${selectedCollection.name}`, 'success');
      setShowMoveModal(false);
    }
  };

  return (
    <>
      <motion.div
        {...staggerItem}
        {...hoverLift}
        onClick={onClick}
        className={`group relative bg-bg-secondary rounded-xl overflow-hidden cursor-pointer ${className}`}
        {...props}
      >
        {/* Recipe Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img 
            src={recipe.thumbnail} 
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-start gap-2">
            {recipe.cooking_time && (
              <Badge text={`⏱️ ${formatTime(recipe.cooking_time)}`} className="bg-black/60 backdrop-blur-md" />
            )}
            {recipe.difficulty && (
              <Badge text={recipe.difficulty} difficulty={recipe.difficulty} />
            )}
          </div>

          {/* Saved Indicator */}
          <div className="absolute top-2 right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </div>

          {/* Quick Actions - Visible on Hover */}
          <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Move to Collection */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMoveModal(true);
              }}
              className="w-8 h-8 bg-blue-500/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              title="Move to collection"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>

            {/* Remove */}
            <button
              onClick={handleRemove}
              className="w-8 h-8 bg-red-500/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              title="Remove from saved"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          
          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
            {/* Title */}
            <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight">
              {recipe.title}
            </h3>
            
            {/* Creator Info */}
            <div className="flex items-center gap-2">
              <Avatar 
                src={recipe.creator?.avatar} 
                alt={recipe.creator?.name}
                size="sm"
              />
              <span className="text-white/80 text-xs truncate">
                {recipe.creator?.name || 'Anonymous'}
              </span>
            </div>
            
            {/* Engagement Stats */}
            <div className="flex items-center gap-3 text-white/70 text-xs">
              <div className="flex items-center gap-1">
                <span>❤️</span>
                <span>{formatNumber(recipe.likes_count || 0)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>👁️</span>
                <span>{formatNumber(recipe.views_count || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Tag (if in specific collection) */}
        {recipe.collection_name && (
          <div className="px-3 py-2 bg-bg-tertiary border-t border-white/5">
            <p className="text-xs text-white/60">
              In: <span className="text-orange-400">{recipe.collection_name}</span>
            </p>
          </div>
        )}
      </motion.div>

      {/* Move to Collection Modal */}
      <Modal
        isOpen={showMoveModal}
        onClose={() => setShowMoveModal(false)}
        title="Move to Collection"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-white/70 text-sm">
            Select a collection to move "{recipe.title}" to:
          </p>

          {/* Collection List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => setSelectedCollection(collection)}
                className={`
                  w-full p-3 rounded-lg text-left transition-all
                  ${selectedCollection?.id === collection.id
                    ? 'bg-orange-500/20 border-2 border-orange-500'
                    : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{collection.name}</p>
                    <p className="text-white/50 text-sm">
                      {collection.recipe_count} recipe{collection.recipe_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {selectedCollection?.id === collection.id && (
                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={() => setShowMoveModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={handleMove}
              disabled={!selectedCollection}
              fullWidth
            >
              Move Recipe
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SavedRecipeCard;