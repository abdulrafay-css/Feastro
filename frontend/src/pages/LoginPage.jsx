import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoginForm } from '@components/auth/LoginForm';
import { GoogleAuthButton } from '@components/auth/GoogleAuthButton';
import { useAuth } from '@hooks/useAuth';
import { Loader } from '@components/common/Loader';

/**
 * Login Page
 */
export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // Redirect to feed if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/feed');
    }
  }, [isAuthenticated, navigate]);

  // Loading state
  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-dark to-dark-lighter">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="text-5xl">🍳</div>
          <span className="text-3xl font-headline font-bold text-primary">
            Feastro
          </span>
        </Link>

        {/* Card */}
        <div className="bg-dark-lighter rounded-2xl p-8 border border-dark-light">
          <h1 className="text-3xl font-headline font-bold mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-gray-light text-center mb-8">
            Login to continue cooking
          </p>

          {/* Google Auth */}
          <GoogleAuthButton />

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-dark-light" />
            <span className="text-gray-light text-sm">or</span>
            <div className="flex-1 h-px bg-dark-light" />
          </div>

          {/* Login Form */}
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-light mt-6">
          By continuing, you agree to Feastro's{' '}
          <Link to="/terms" className="text-primary hover:text-primary-light">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-primary hover:text-primary-light">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
};