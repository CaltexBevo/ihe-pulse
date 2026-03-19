'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Always return dark as the default - no system preference check
function getDefaultTheme(): ResolvedTheme {
  return 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [mounted, setMounted] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('ihe-theme') as Theme | null;
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      setThemeState(saved);
    }
    setMounted(true);
  }, []);

  // Resolve the actual theme and apply to document
  useEffect(() => {
    if (!mounted) return;

    const resolved = theme === 'system' ? getDefaultTheme() : theme;
    setResolvedTheme(resolved);

    // Apply theme to document
    document.documentElement.setAttribute('data-theme', resolved);
  }, [theme, mounted]);

  // No longer listening for system theme changes since we always default to dark
  // Users who explicitly set light mode will have it stored in localStorage

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('ihe-theme', newTheme);
  };

  // Prevent flash by not rendering until mounted
  // Dark is always default for first-time visitors
  if (!mounted) {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var saved = localStorage.getItem('ihe-theme');
                var theme = saved;
                if (!theme || theme === 'system') {
                  theme = 'dark';
                }
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            })();
          `,
        }}
      />
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
