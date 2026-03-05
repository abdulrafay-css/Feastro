/**
 * Loading spinner component
 */
export const Loader = ({ size = 'medium', color = 'primary', fullScreen = false }) => {
  const sizes = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  };
  
  const colors = {
    primary: 'border-primary border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray border-t-transparent',
  };
  
  const spinner = (
    <div className={`spinner ${sizes[size]} ${colors[color]} rounded-full animate-spin`} />
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dark bg-opacity-80 z-50">
        {spinner}
      </div>
    );
  }
  
  return spinner;
};

/**
 * Skeleton loader for content
 */
export const Skeleton = ({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    thumbnail: 'h-48 w-full',
    card: 'h-64 w-full',
  };
  
  return (
    <div className={`skeleton ${variants[variant]} ${className}`} />
  );
};