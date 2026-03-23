/**
 * Recipe Tabs Component
 * Tabs for "My Recipes", "Liked", "Saved"
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';
import RecipeGrid from '../home/RecipeGrid';

const RecipeTabs = ({ 
  myRecipes = [],
  likedRecipes = [],
  savedRecipes = [],
  onRecipeClick,
  onLike,
  onSave,
  loading = false,
  className = '',
  ...props 
}) => {
  const [activeTab, setActiveTab] = useState('my-recipes');

  const tabs = [
    {
      id: 'my-recipes',
      label: 'My Recipes',
      icon: '📝',
      count: myRecipes.length,
      recipes: myRecipes,
    },
    {
      id: 'liked',
      label: 'Liked',
      icon: '❤️',
      count: likedRecipes.length,
      recipes: likedRecipes,
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: '🔖',
      count: savedRecipes.length,
      recipes: savedRecipes,
    },
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className={`w-full ${className}`} {...props}>
      {/* Tab Headers */}
      <div className="flex gap-1 mb-6 overflow-x-auto scrollbar-hide border-b border-white/10">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-6 py-3 text-sm md:text-base font-medium whitespace-nowrap
                transition-all
                ${isActive 
                  ? 'text-white' 
                  : 'text-white/60 hover:text-white/80'
                }
              `}
            >
              {/* Tab Content */}
              <div className="flex items-center gap-2">
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs
                    ${isActive 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white/10 text-white/60'
                    }
                  `}>
                    {tab.count}
                  </span>
                )}
              </div>

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        {...fadeInUp}
      >
        {currentTab.recipes.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-6xl mb-4">{currentTab.icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No {currentTab.label.toLowerCase()} yet
            </h3>
            <p className="text-white/60 text-center max-w-md">
              {activeTab === 'my-recipes' && "Start creating your first recipe to share with the community"}
              {activeTab === 'liked' && "Recipes you like will appear here"}
              {activeTab === 'saved' && "Recipes you save will appear here"}
            </p>
          </div>
        ) : (
          <RecipeGrid
            recipes={currentTab.recipes}
            loading={loading}
            onRecipeClick={onRecipeClick}
            onLike={onLike}
            onSave={onSave}
          />
        )}
      </motion.div>
    </div>
  );
};

export default RecipeTabs;