import { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '@services/storageService';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  // Initialize theme
  useEffect(() => {
    const storedTheme = storageService.getTheme();
    setTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  /**
   * Apply theme to document
   */
  const applyTheme = (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  /**
   * Toggle theme
   */
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    storageService.setTheme(newTheme);
    applyTheme(newTheme);
  };

  /**
   * Set specific theme
   */
  const setSpecificTheme = (newTheme) => {
    setTheme(newTheme);
    storageService.setTheme(newTheme);
    applyTheme(newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: setSpecificTheme,
    isDark: theme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};