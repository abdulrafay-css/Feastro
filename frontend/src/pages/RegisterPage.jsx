/**
 * Register Page
 * User registration with social auth
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';
import RegisterForm from '../components/auth/RegisterForm';
import SocialAuth from '../components/auth/SocialAuth';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    // API call to register
    console.log('Register:', formData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to onboarding
    navigate('/onboarding');
  };

  const handleGoogleAuth = async () => {
    console.log('Google auth');
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/onboarding');
  };

  const handleFacebookAuth = async () => {
    console.log('Facebook auth');
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/onboarding');
  };

  const handleAppleAuth = async () => {
    console.log('Apple auth');
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6 py-12">
      <motion.div
        {...staggerContainer}
        className="max-w-md w-full space-y-8"
      >
        {/* Logo & Title */}
        <motion.div {...staggerItem} className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/30">
              <span className="text-white font-bold text-4xl">F</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white">
            Create Account
          </h1>
          
          <p className="text-white/70">
            Join Feastro and start discovering recipes
          </p>
        </motion.div>

        {/* Social Auth */}
        <motion.div {...staggerItem}>
          <SocialAuth
            onGoogleAuth={handleGoogleAuth}
            onFacebookAuth={handleFacebookAuth}
            onAppleAuth={handleAppleAuth}
          />
        </motion.div>

        {/* Register Form */}
        <motion.div {...staggerItem}>
          <RegisterForm onSubmit={handleRegister} />
        </motion.div>

        {/* Login Link */}
        <motion.div {...staggerItem} className="text-center">
          <p className="text-white/70">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;