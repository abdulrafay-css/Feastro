/**
 * Login Page
 * User login with social auth
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';
import LoginForm from '../components/auth/LoginForm';
import SocialAuth from '../components/auth/SocialAuth';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    // API call to login
    console.log('Login:', formData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to home
    navigate('/');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleGoogleAuth = async () => {
    console.log('Google auth');
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/');
  };

  const handleFacebookAuth = async () => {
    console.log('Facebook auth');
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/');
  };

  const handleAppleAuth = async () => {
    console.log('Apple auth');
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/');
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
            Welcome Back
          </h1>
          
          <p className="text-white/70">
            Sign in to continue to Feastro
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

        {/* Login Form */}
        <motion.div {...staggerItem}>
          <LoginForm
            onSubmit={handleLogin}
            onForgotPassword={handleForgotPassword}
          />
        </motion.div>

        {/* Sign Up Link */}
        <motion.div {...staggerItem} className="text-center">
          <p className="text-white/70">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              Sign up
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;