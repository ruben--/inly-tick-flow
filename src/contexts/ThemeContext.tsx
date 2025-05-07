
import { createContext, useContext, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  theme: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Apply TE theme styling to document root
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove any other theme classes and set TE theme
    root.classList.remove('theme-default');
    root.classList.add('theme-teenage-engineering');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'teenage-engineering' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
