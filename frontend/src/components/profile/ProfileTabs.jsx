import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Profile Tabs Component
 */
export const ProfileTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-dark-light">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative flex-1 py-4 text-center font-medium transition-colors"
          >
            <span
              className={
                activeTab === tab.id ? 'text-white' : 'text-gray-light'
              }
            >
              {tab.label}
            </span>

            {/* Active indicator */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};