/**
 * Stats Card Component
 * Individual stat display with icon and trend
 */

import { motion } from 'framer-motion';
import { scaleIn } from '../../utils/animations';
import { formatNumber } from '../../utils/formatters';

const StatsCard = ({ 
  label,
  value,
  icon,
  trend,
  color = 'orange',
  onClick,
  className = '',
  ...props 
}) => {
  const colors = {
    orange: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/20',
    },
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
    },
    green: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/20',
    },
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/20',
    },
  };

  const colorScheme = colors[color] || colors.orange;

  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      {...scaleIn}
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`
        ${colorScheme.bg} ${colorScheme.border}
        border rounded-xl p-4 md:p-6
        ${onClick ? 'cursor-pointer hover:bg-opacity-20' : ''}
        transition-all
        ${className}
      `}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Icon */}
        {icon && (
          <div className={`${colorScheme.text} text-2xl md:text-3xl`}>
            {icon}
          </div>
        )}

        {/* Trend */}
        {trend && (
          <div className={`flex items-center gap-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'} text-xs font-medium`}>
            <svg 
              className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mt-3 md:mt-4">
        <div className="text-3xl md:text-4xl font-bold text-white">
          {formatNumber(value)}
        </div>
        <div className="text-sm text-white/60 mt-1">
          {label}
        </div>
      </div>
    </Component>
  );
};

export default StatsCard;