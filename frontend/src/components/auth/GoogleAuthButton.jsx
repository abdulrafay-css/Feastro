import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@components/common/Button';
import { useAuth } from '@hooks/useAuth';
import { FEATURES } from '@utils/constants';
import toast from 'react-hot-toast';

/**
 * Google Auth Button Component
 */
export const GoogleAuthButton = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  /**
   * Handle Google login
   */
  const handleGoogleLogin = async () => {
    if (!FEATURES.GOOGLE_AUTH) {
      toast.error('Google authentication is not enabled');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement actual Google OAuth flow
      // This is a placeholder for Google OAuth integration
      toast.error('Google OAuth not yet implemented');
      
      // When implemented:
      // 1. Open Google OAuth popup
      // 2. Get authorization code
      // 3. Exchange for token
      // 4. Call loginWithGoogle(token)
      // 5. Navigate to /feed
    } catch (error) {
      toast.error(error.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  if (!FEATURES.GOOGLE_AUTH) {
    return null;
  }

  return (
    <Button
      variant="secondary"
      fullWidth
      onClick={handleGoogleLogin}
      loading={loading}
      icon={<FcGoogle size={20} />}
    >
      Continue with Google
    </Button>
  );
};