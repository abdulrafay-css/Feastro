/**
 * Profile Header Component
 * User profile info with avatar, stats, and actions
 */

import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { formatNumber } from '../../utils/formatters';

const ProfileHeader = ({ 
  user,
  isOwnProfile = false,
  isFollowing = false,
  onFollow,
  onEdit,
  onShare,
  className = '',
  ...props 
}) => {
  const {
    id,
    name,
    username,
    avatar,
    bio,
    verified = false,
    stats = {
      recipes: 0,
      followers: 0,
      following: 0,
      likes: 0,
    },
    social_links = {},
  } = user;

  return (
    <motion.div 
      {...fadeInUp}
      className={`w-full ${className}`}
      {...props}
    >
      {/* Cover Image (Optional) */}
      {user.cover_image && (
        <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-t-2xl">
          <img 
            src={user.cover_image} 
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-primary" />
        </div>
      )}

      {/* Profile Info */}
      <div className="px-6 py-6 space-y-6">
        {/* Avatar & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar */}
          <div className={user.cover_image ? '-mt-20' : ''}>
            <Avatar
              src={avatar}
              alt={name}
              size="2xl"
              className="border-4 border-bg-primary shadow-xl"
            />
          </div>

          {/* Name & Username */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {name}
              </h1>
              {verified && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center" title="Verified">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-white/60 text-sm md:text-base">
              @{username}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            {isOwnProfile ? (
              <>
                <Button
                  variant="secondary"
                  onClick={onEdit}
                  className="flex-1 sm:flex-none"
                >
                  Edit Profile
                </Button>
                <Button
                  variant="ghost"
                  onClick={onShare}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  }
                />
              </>
            ) : (
              <>
                <Button
                  variant={isFollowing ? 'secondary' : 'primary'}
                  onClick={onFollow}
                  className="flex-1 sm:flex-none"
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={onShare}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  }
                />
              </>
            )}
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <div>
            <p className="text-white/90 leading-relaxed">
              {bio}
            </p>
          </div>
        )}

        {/* Social Links */}
        {Object.keys(social_links).length > 0 && (
          <div className="flex flex-wrap gap-3">
            {social_links.website && (
              
                href={social_links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Website
              </a>
            )}
            {social_links.instagram && (
              
                href={`https://instagram.com/${social_links.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm transition-colors"
              >
                <span>📷</span>
                Instagram
              </a>
            )}
            {social_links.youtube && (
              
                href={social_links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm transition-colors"
              >
                <span>▶️</span>
                YouTube
              </a>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
          <button className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
            <span className="text-2xl font-bold text-white">
              {formatNumber(stats.recipes)}
            </span>
            <span className="text-white/60 text-xs md:text-sm">
              Recipes
            </span>
          </button>

          <button className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
            <span className="text-2xl font-bold text-white">
              {formatNumber(stats.followers)}
            </span>
            <span className="text-white/60 text-xs md:text-sm">
              Followers
            </span>
          </button>

          <button className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
            <span className="text-2xl font-bold text-white">
              {formatNumber(stats.following)}
            </span>
            <span className="text-white/60 text-xs md:text-sm">
              Following
            </span>
          </button>

          <button className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
            <span className="text-2xl font-bold text-white">
              {formatNumber(stats.likes)}
            </span>
            <span className="text-white/60 text-xs md:text-sm">
              Likes
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;