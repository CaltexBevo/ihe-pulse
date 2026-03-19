'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();

  const toggleTheme = () => {
    // If currently using a resolved theme, toggle to the opposite
    // This overrides system preference
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-colors duration-200 hover:bg-[var(--surface)] border border-transparent hover:border-[var(--border)]"
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun size={18} className="text-[var(--text-secondary)] hover:text-[var(--amber)]" aria-hidden="true" />
      ) : (
        <Moon size={18} className="text-[var(--text-secondary)] hover:text-[var(--purple)]" aria-hidden="true" />
      )}
    </button>
  );
}
