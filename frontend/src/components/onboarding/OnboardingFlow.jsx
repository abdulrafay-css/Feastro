/**
 * Onboarding Flow Component
 * Main onboarding flow controller
 */

import { AnimatePresence, motion } from 'framer-motion';
import { pageTransitionFade } from '../../utils/animations';
import { useOnboarding } from '../../context/OnboardingContext';
import WelcomeScreen from './WelcomeScreen';
import PreferencesScreen from './PreferencesScreen';
import Button from '../common/Button';

const OnboardingFlow = ({ 
  onComplete,
  className = '',
  ...props 
}) => {
  const {
    currentStep,
    nextStep,
    prevStep,
    skipOnboarding,
    completeOnboarding,
    currentStepData,
  } = useOnboarding();

  const handleComplete = async () => {
    const success = await completeOnboarding();
    if (success) {
      onComplete?.();
    }
  };

  return (
    <div className={`fixed inset-0 bg-bg-primary z-50 overflow-y-auto ${className}`} {...props}>
      <AnimatePresence mode="wait">
        {/* Step 0: Welcome */}
        {currentStep === 0 && (
          <motion.div
            key="welcome"
            {...pageTransitionFade}
          >
            <WelcomeScreen
              onNext={nextStep}
              onSkip={skipOnboarding}
            />
          </motion.div>
        )}

        {/* Step 1: Preferences */}
        {currentStep === 1 && (
          <motion.div
            key="preferences"
            {...pageTransitionFade}
          >
            <PreferencesScreen
              onNext={nextStep}
              onBack={prevStep}
            />
          </motion.div>
        )}

        {/* Step 2: Complete */}
        {currentStep === 2 && (
          <motion.div
            key="complete"
            {...pageTransitionFade}
            className="flex flex-col items-center justify-center min-h-screen px-6"
          >
            <div className="max-w-md w-full text-center space-y-8">
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="flex justify-center"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30">
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="w-16 h-16 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                </div>
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <h1 className="text-4xl font-bold text-white">
                  You're All Set! 🎉
                </h1>
                <p className="text-lg text-white/70">
                  Your personalized feed is ready. Start discovering amazing recipes!
                </p>
              </motion.div>

              {/* Quick Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-3"
              >
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-left">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💡</div>
                    <div>
                      <h3 className="text-white font-semibold text-sm mb-1">
                        Pro Tip
                      </h3>
                      <p className="text-white/60 text-xs">
                        Swipe up and down to navigate between videos, tap the heart to like, and bookmark to save for later!
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Complete Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <Button
                  onClick={handleComplete}
                  fullWidth
                  size="lg"
                >
                  Start Exploring
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingFlow;