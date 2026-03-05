import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@components/common/Button';
import { useAuth } from '@hooks/useAuth';

/**
 * Home Page - Landing page
 */
export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect to feed if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/feed');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-dark to-dark-lighter">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-8xl mb-6"
        >
          🍳
        </motion.div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-headline font-bold mb-6">
          Cook What You{' '}
          <span className="text-primary">Watch</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-light mb-12 max-w-2xl mx-auto">
          Turn food reels into actionable recipes. Discover, save, and cook delicious meals
          from short-form food content.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            size="large"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          <FeatureCard
            icon="📹"
            title="Vertical Food Feed"
            description="Scroll through engaging food videos just like your favorite social apps"
          />
          <FeatureCard
            icon="📖"
            title="Structured Recipes"
            description="Every video comes with detailed ingredients and step-by-step instructions"
          />
          <FeatureCard
            icon="💾"
            title="Save & Search"
            description="Build your personal recipe collection and find exactly what you're craving"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

/**
 * Feature Card Component
 */
const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 bg-dark-lighter rounded-2xl border border-dark-light"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-headline font-bold mb-2">{title}</h3>
      <p className="text-gray-light">{description}</p>
    </motion.div>
  );
};