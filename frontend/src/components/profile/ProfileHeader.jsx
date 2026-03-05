import { useState } from 'react';
import { motion } from 'framer-motion';
import { IoSettings, IoShareSocial } from 'react-icons/io5';
import { Button } from '@components/common/Button';
import { formatNumber, getInitials } from '@utils/helpers';
import { useAuth } from '@hooks/useAuth';
import { userService } from '@services/userService';
import toast from 'react-hot-toast';

/**
 * Profile Header Component
 */
export const ProfileHeader = ({ profile, onFollowChange }) => {
  const { user: currentUser } = useAuth();
  const [following, setFollowing] = useState(profile.is_following);
  const [loading, setLoading] = useState(false);

  const isOwnProfile = currentUser?.id === profile.id;

  /**
   * Handle follow/unfollow
   */
  const handleFollowToggle = async () => {
    if (loading) return;

    setLoading(true);
    const previousState = following;
    setFollowing(!following);

    try {
      if (following) {
        await userService.unfollowUser(profile.id);
        toast.success('Unfollowed');
      } else {
        await userService.followUser(profile.id);
        toast.success('Following');
      }

      if (onFollowChange) {
        onFollowChange(!following);
      }
    } catch (error) {
      setFollowing(previousState);
      toast.error(error.message || 'Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle share profile
   */
  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/profile/${profile.username}`;

      if (navigator.share) {
        await navigator.share({
          title: `${profile.username} on Feastro`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Profile link copied to clipboard!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error('Failed to share profile');
      }
    }
  };

  return (
    <div className="p-6">
      {/* Avatar and Stats Row */}
      <div className="flex items-start gap-6 mb-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="w-24 h-24 rounded-full object-cover border-2 border-primary"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl font-headline font-bold">
              {getInitials(profile.username)}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex-1 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-headline font-bold">
              {formatNumber(profile.recipes_count)}
            </div>
            <div className="text-sm text-gray-light">Recipes</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-headline font-bold">
              {formatNumber(profile.followers_count)}
            </div>
            <div className="text-sm text-gray-light">Followers</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-headline font-bold">
              {formatNumber(profile.following_count)}
            </div>
            <div className="text-sm text-gray-light">Following</div>
          </div>
        </div>
      </div>

      {/* Username and Bio */}
      <div className="mb-6">
        <h1 className="text-2xl font-headline font-bold mb-2">
          @{profile.username}
        </h1>

        {profile.bio && (
          <p className="text-gray-light leading-relaxed">{profile.bio}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {isOwnProfile ? (
          <>
            <Button
              variant="primary"
              fullWidth
              icon={<IoSettings size={20} />}
              onClick={() => (window.location.href = '/profile/edit')}
            >
              Edit Profile
            </Button>
            <Button
              variant="secondary"
              icon={<IoShareSocial size={20} />}
              onClick={handleShare}
            >
              Share
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={following ? 'secondary' : 'primary'}
              fullWidth
              loading={loading}
              onClick={handleFollowToggle}
            >
              {following ? 'Following' : 'Follow'}
            </Button>
            <Button
              variant="secondary"
              icon={<IoShareSocial size={20} />}
              onClick={handleShare}
            >
              Share
            </Button>
          </>
        )}
      </div>
    </div>
  );
};