/**
 * Onboarding Context
 * Manages onboarding flow state for new users
 * 
 * Usage:
 * import { useOnboarding } from '@/context/OnboardingContext';
 * 
 * const { currentStep, completeOnboarding } = useOnboarding();
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Create Context
const OnboardingContext = createContext();

// Custom hook to use onboarding
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

// Onboarding steps configuration
const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Feastro',
    description: 'Discover amazing recipes in short video format',
  },
  {
    id: 'preferences',
    title: 'Set Your Preferences',
    description: 'Tell us what you like to cook',
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Start discovering recipes',
  },
];

// Local storage key
const STORAGE_KEY = 'feastro_onboarding_completed';

// Onboarding Provider Component
export const OnboardingProvider = ({ children }) => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    dietaryRestrictions: [],
    cuisinePreferences: [],
    skillLevel: 'beginner',
    cookingTime: 'any',
  });
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if onboarding is already completed on mount
  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (completed === 'true') {
      setIsOnboardingComplete(true);
      setShowOnboarding(false);
    } else {
      setShowOnboarding(true);
    }
  }, []);

  /**
   * Move to next step
   */
  const nextStep = useCallback(() => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  /**
   * Move to previous step
   */
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  /**
   * Go to specific step
   */
  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < ONBOARDING_STEPS.length) {
      setCurrentStep(stepIndex);
    }
  }, []);

  /**
   * Update user preferences
   */
  const updatePreferences = useCallback((key, value) => {
    setUserPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Complete onboarding
   */
  const completeOnboarding = useCallback(async () => {
    try {
      // Save preferences to backend (if needed)
      // await saveUserPreferences(userPreferences);
      
      // Mark as complete in local storage
      localStorage.setItem(STORAGE_KEY, 'true');
      
      setIsOnboardingComplete(true);
      setShowOnboarding(false);
      
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  }, [userPreferences]);

  /**
   * Skip onboarding
   */
  const skipOnboarding = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOnboardingComplete(true);
    setShowOnboarding(false);
  }, []);

  /**
   * Reset onboarding (for testing or re-onboarding)
   */
  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsOnboardingComplete(false);
    setCurrentStep(0);
    setShowOnboarding(true);
    setUserPreferences({
      dietaryRestrictions: [],
      cuisinePreferences: [],
      skillLevel: 'beginner',
      cookingTime: 'any',
    });
  }, []);

  /**
   * Check if current step is first
   */
  const isFirstStep = currentStep === 0;

  /**
   * Check if current step is last
   */
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  /**
   * Get progress percentage
   */
  const progressPercentage = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const value = {
    // State
    isOnboardingComplete,
    showOnboarding,
    currentStep,
    userPreferences,
    steps: ONBOARDING_STEPS,
    
    // Step info
    isFirstStep,
    isLastStep,
    progressPercentage,
    currentStepData: ONBOARDING_STEPS[currentStep],
    
    // Actions
    nextStep,
    prevStep,
    goToStep,
    updatePreferences,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Export default
export default OnboardingContext;