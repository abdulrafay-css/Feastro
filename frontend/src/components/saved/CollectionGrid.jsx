/**
 * Collection Grid Component
 * Grid layout for displaying collections
 */

import { motion } from 'framer-motion';
import { staggerContainer } from '../../utils/animations';
import CollectionCard from './CollectionCard';
import Skeleton from '../common/Skeleton';
import Button from '../common/Button';

const CollectionGrid = ({ 
  collections = [],
  loading = false,
  onCollectionClick,
  onDelete,
  onCreateNew,
  className = '',
  ...props 
}) => {
  // Loading State
  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`} {...props}>
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-square w-full" />
            <Skeleton variant="text" className="w-3/4" />
            <Skeleton variant="text" className="w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (!loading && collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-8xl mb-4">📁</div>
        <h3 className="text-2xl font-bold text-white mb-2">
          No collections yet
        </h3>
        <p className="text-white/60 text-center max-w-md mb-6">
          Create your first collection to organize your favorite recipes
        </p>
        {onCreateNew && (
          <Button onClick={onCreateNew}>
            Create Collection
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={className} {...props}>
      {/* Create New Collection Card */}
      {onCreateNew && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateNew}
          className="w-full aspect-square bg-bg-secondary border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-3 text-white/60 hover:text-white hover:border-orange-500/50 hover:bg-white/5 transition-all mb-4"
        >
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">Create New Collection</span>
        </motion.button>
      )}

      {/* Collections Grid */}
      <motion.div 
        {...staggerContainer}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            onClick={() => onCollectionClick?.(collection)}
            onDelete={onDelete}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default CollectionGrid;