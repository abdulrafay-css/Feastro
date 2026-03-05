import { forwardRef } from 'react';

/**
 * Reusable Input component
 */
export const Input = forwardRef(({
  label,
  error,
  icon,
  fullWidth = true,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`${widthClass} ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-light mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          className={`input-field ${widthClass} ${icon ? 'pl-12' : ''} ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';