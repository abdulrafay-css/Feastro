/**
 * Preferences Screen Component
 * Second screen - collect user preferences
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations';
import Button from '../common/Button';
import Chip from '../common/Chip';
import { useOnboarding } from '../../context/OnboardingContext';

const PreferencesScreen = ({ 
  onNext,
  onBack,
  className = '',
  ...props 
}) => {
  const { userPreferences, updatePreferences } = useOnboarding();
  
  const [selectedDietary, setSelectedDietary] = useState(userPreferences.dietaryRestrictions || []);
  const [selectedCuisines, setSelectedCuisines] = useState(userPreferences.cuisinePreferences || []);
  const [skillLevel, setSkillLevel] = useState(userPreferences.skillLevel || 'beginner');
  const [cookingTime, setCookingTime] = useState(userPreferences.cookingTime || 'any');

  const dietaryOptions = [
    { id: 'vegetarian', label: '🌱 Vegetarian' },
    { id: 'vegan', label: '🥬 Vegan' },
    { id: 'gluten-free', label: '🌾 Gluten-Free' },
    { id: 'dairy-free', label: '🥛 Dairy-Free' },
    { id: 'keto', label: '🥑 Keto' },
    { id: 'paleo', label: '🥩 Paleo' },
    { id: 'low-carb', label: '🥑 Low-Carb' },
    { id: 'high-protein', label: '💪 High-Protein' },
    { id: 'nut-free', label: '🥜 Nut-Free' },
  ];

  const cuisineOptions = [
    { id: 'italian', label: '🇮🇹 Italian' },
    { id: 'chinese', label: '🇨🇳 Chinese' },
    { id: 'mexican', label: '🇲🇽 Mexican' },
    { id: 'indian', label: '🇮🇳 Indian' },
    { id: 'japanese', label: '🇯🇵 Japanese' },
    { id: 'thai', label: '🇹🇭 Thai' },
    { id: 'french', label: '🇫🇷 French' },
    { id: 'american', label: '🇺🇸 American' },
  ];

  const skillLevels = [
    { id: 'beginner', label: 'Beginner', icon: '🌱' },
    { id: 'intermediate', label: 'Intermediate', icon: '👨‍🍳' },
    { id: 'advanced', label: 'Advanced', icon: '⭐' },
  ];

  const cookingTimes = [
    { id: 'any', label: 'Any time' },
    { id: 'quick', label: 'Under 30 min' },
    { id: 'medium', label: '30-60 min' },
    { id: 'long', label: 'Over 1 hour' },
  ];

  const toggleDietary = (id) => {
    setSelectedDietary(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const toggleCuisine = (id) => {
    setSelectedCuisines(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    // Save preferences to context
    updatePreferences('dietaryRestrictions', selectedDietary);
    updatePreferences('cuisinePreferences', selectedCuisines);
    updatePreferences('skillLevel', skillLevel);
    updatePreferences('cookingTime', cookingTime);
    
    onNext?.();
  };

  return (
    <div className={`flex flex-col min-h-screen px-6 py-12 ${className}`} {...props}>
      <motion.div
        {...staggerContainer}
        className="max-w-2xl w-full mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div {...staggerItem} className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Customize Your Experience
          </h1>
          <p className="text-white/70">
            Tell us your preferences to get personalized recommendations
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div {...staggerItem} className="flex gap-2">
          <div className="flex-1 h-1 bg-orange-500 rounded-full" />
          <div className="flex-1 h-1 bg-orange-500 rounded-full" />
          <div className="flex-1 h-1 bg-white/20 rounded-full" />
        </motion.div>

        {/* Dietary Restrictions */}
        <motion.div {...staggerItem} className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            Dietary Restrictions
          </h2>
          <p className="text-sm text-white/60">
            Select any that apply (optional)
          </p>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map(option => (
              <Chip
                key={option.id}
                label={option.label}
                selected={selectedDietary.includes(option.id)}
                onClick={() => toggleDietary(option.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* Favorite Cuisines */}
        <motion.div {...staggerItem} className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            Favorite Cuisines
          </h2>
          <p className="text-sm text-white/60">
            Choose your favorites (optional)
          </p>
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map(option => (
              <Chip
                key={option.id}
                label={option.label}
                selected={selectedCuisines.includes(option.id)}
                onClick={() => toggleCuisine(option.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* Skill Level */}
        <motion.div {...staggerItem} className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            Cooking Skill Level
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {skillLevels.map(level => (
              <button
                key={level.id}
                onClick={() => setSkillLevel(level.id)}
                className={`
                  p-4 rounded-xl border-2 transition-all
                  ${skillLevel === level.id
                    ? 'border-orange-500 bg-orange-500/20'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }
                `}
              >
                <div className="text-3xl mb-2">{level.icon}</div>
                <div className="text-sm font-medium text-white">
                  {level.label}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cooking Time Preference */}
        <motion.div {...staggerItem} className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            Preferred Cooking Time
          </h2>
          <div className="flex flex-wrap gap-2">
            {cookingTimes.map(time => (
              <Chip
                key={time.id}
                label={time.label}
                selected={cookingTime === time.id}
                onClick={() => setCookingTime(time.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div {...staggerItem} className="flex gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1"
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PreferencesScreen;