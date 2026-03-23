/**
 * Welcome Screen Component
 * First screen of onboarding flow
 */

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations';
import Button from '../common/Button';

const WelcomeScreen = ({ 
  onNext,
  onSkip,
  className = '',
  ...props 
}) => {
  const features = [
    {
      icon: '🎬',
      title: 'Short Recipe Videos',
      description: 'Watch quick, engaging cooking videos',
    },
    {
      icon: '💾',
      title: 'Save Your Favorites',
      description: 'Create collections and organize recipes',
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Find recipes by ingredients, cuisine, or diet',
    },
    {
      icon: '👨‍🍳',
      title: 'Share Your Recipes',
      description: 'Become a creator and inspire others',
    },
  ];

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen px-6 ${className}`} {...props}>
      <motion.div
        {...staggerContainer}
        className="max-w-md w-full space-y-8"
      >
        {/* Logo & Title */}
        <motion.div {...staggerItem} className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30">
              <span className="text-white font-bold text-5xl">F</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Welcome to Feastro
          </h1>
          
          <p className="text-lg text-white/70">
            Discover delicious recipes in bite-sized videos
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div {...staggerItem} className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              {...staggerItem}
              className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="text-white font-semibold text-sm mb-1">
                {feature.title}
              </h3>
              <p className="text-white/60 text-xs leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div {...staggerItem} className="space-y-3">
          <Button
            onClick={onNext}
            fullWidth
            size="lg"
          >
            Get Started
          </Button>
          
          <button
            onClick={onSkip}
            className="w-full text-white/60 hover:text-white text-sm transition-colors"
          >
            Skip for now
          </button>
        </motion.div>

        {/* Terms */}
        <motion.p {...staggerItem} className="text-center text-xs text-white/40">
          By continuing, you agree to our{' '}
          <a href="/terms" className="text-orange-400 hover:text-orange-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-orange-400 hover:text-orange-300">
            Privacy Policy
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;