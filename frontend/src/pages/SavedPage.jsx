/**
 * Saved Page
 * User's saved recipes and collections
 */

import { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import CollectionGrid from '../components/saved/CollectionGrid';
import SavedRecipeCard from '../components/saved/SavedRecipeCard';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useToast } from '../context/ToastContext';
import FeedModal from '../components/feed/FeedModal';

const SavedPage = () => {
  const { showToast } = useToast();
  const [view, setView] = useState('collections'); // 'collections' or 'all-recipes'
  const [collections, setCollections] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [, setSelectedCollection] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedModalOpen, setFeedModalOpen] = useState(false);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0);

  useEffect(() => {
    fetchCollections();
    fetchSavedRecipes();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockCollections = [
        {
          id: 'all',
          name: 'All Saved',
          description: 'All your saved recipes',
          recipe_count: 24,
          cover_images: [
            'https://picsum.photos/seed/col1/400/600',
            'https://picsum.photos/seed/col2/400/600',
            'https://picsum.photos/seed/col3/400/600',
            'https://picsum.photos/seed/col4/400/600',
          ],
          color: '#FF7A00',
        },
        ...Array(5).fill(0).map((_, i) => ({
          id: `collection-${i}`,
          name: `Collection ${i + 1}`,
          description: `My favorite ${['breakfast', 'lunch', 'dinner', 'desserts', 'quick meals'][i]} recipes`,
          recipe_count: 5 + i,
          cover_images: Array(4).fill(0).map((_, j) => 
            `https://picsum.photos/seed/c${i}r${j}/400/600`
          ),
          color: ['#FF7A00', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'][i],
        })),
      ];
      setCollections(mockCollections);
      setLoading(false);
    }, 800);
  };

  const fetchSavedRecipes = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockSaved = Array(16).fill(0).map((_, i) => ({
        id: `saved-${i}`,
        title: `Saved Recipe ${i + 1}`,
        thumbnail: `https://picsum.photos/seed/saved${i}/400/600`,
        creator: {
          name: `Chef ${i + 1}`,
          username: `chef${i + 1}`,
          avatar: `https://i.pravatar.cc/150?img=${i + 50}`,
        },
        cooking_time: 30,
        difficulty: ['easy', 'medium', 'hard'][i % 3],
        likes_count: 1000,
        saves_count: 500,
        views_count: 5000,
        is_saved: true,
        collection_name: i % 3 === 0 ? 'Quick Meals' : null,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      }));
      setSavedRecipes(mockSaved);
    }, 800);
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      showToast('Please enter a collection name', 'error');
      return;
    }

    // API call to create collection
    const newCollection = {
      id: `collection-${Date.now()}`,
      name: newCollectionName,
      description: newCollectionDescription,
      recipe_count: 0,
      cover_images: [],
      color: '#FF7A00',
    };

    setCollections(prev => [...prev, newCollection]);
    setNewCollectionName('');
    setNewCollectionDescription('');
    setShowCreateModal(false);
    showToast('Collection created! 🎉', 'success');
  };

  const handleDeleteCollection = (collection) => {
    if (confirm(`Delete "${collection.name}"?`)) {
      setCollections(prev => prev.filter(c => c.id !== collection.id));
      showToast('Collection deleted', 'success');
    }
  };

  const handleRemoveRecipe = (recipe) => {
    setSavedRecipes(prev => prev.filter(r => r.id !== recipe.id));
  };

  const handleMoveToCollection = (recipe, collection) => {
    console.log('Moving recipe to collection:', recipe, collection);
  };

  const handleRecipeClick = (recipe) => {
    const index = savedRecipes.findIndex(r => r.id === recipe.id);
    setSelectedRecipeIndex(index);
    setFeedModalOpen(true);
  };

  return (
    <PageLayout
      title="Saved"
      headerActions={
        view === 'collections' ? (
          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            New
          </Button>
        ) : null
      }
    >
      <div className="space-y-6">
        {/* View Toggle */}
        <div className="flex gap-2 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setView('collections')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              view === 'collections'
                ? 'bg-orange-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Collections
          </button>
          <button
            onClick={() => setView('all-recipes')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              view === 'all-recipes'
                ? 'bg-orange-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            All Recipes
          </button>
        </div>

        {/* Collections View */}
        {view === 'collections' && (
          <CollectionGrid
            collections={collections}
            loading={loading}
            onCollectionClick={setSelectedCollection}
            onDelete={handleDeleteCollection}
            onCreateNew={() => setShowCreateModal(true)}
          />
        )}

        {/* All Recipes View */}
        {view === 'all-recipes' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {savedRecipes.map((recipe) => (
              <SavedRecipeCard
                key={recipe.id}
                recipe={recipe}
                collections={collections}
                onClick={() => handleRecipeClick(recipe)}
                onRemove={handleRemoveRecipe}
                onMoveToCollection={handleMoveToCollection}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Collection Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Collection"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Collection Name"
            placeholder="e.g., Quick Dinners"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            required
          />

          <Input
            label="Description (Optional)"
            placeholder="What's this collection about?"
            value={newCollectionDescription}
            onChange={(e) => setNewCollectionDescription(e.target.value)}
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowCreateModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCollection}
              fullWidth
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>

      {/* Feed Modal */}
      <FeedModal
        isOpen={feedModalOpen}
        onClose={() => setFeedModalOpen(false)}
        initialRecipes={savedRecipes}
        initialIndex={selectedRecipeIndex}
      />
    </PageLayout>
  );
};

export default SavedPage;