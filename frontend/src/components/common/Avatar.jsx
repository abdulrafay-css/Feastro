/**
 * Avatar Component
 * User profile image with fallback
 */

const Avatar = ({ 
  src,
  alt = 'User',
  size = 'md',
  fallback,
  className = '',
  ...props 
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };
  
  // Get initials from name for fallback
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <div
      className={`
        ${sizes[size]}
        rounded-full overflow-hidden
        bg-gradient-to-br from-orange-500 to-orange-600
        flex items-center justify-center
        text-white font-semibold
        ${className}
      `}
      {...props}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <span>{fallback || getInitials(alt)}</span>
      )}
    </div>
  );
};

export default Avatar;