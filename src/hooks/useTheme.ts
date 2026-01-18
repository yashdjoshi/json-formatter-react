import { useEffect, useState } from 'react';
import { useFormatterStore } from '@/stores/useFormatterStore';

export function useTheme() {
  const theme = useFormatterStore((state) => state.theme);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial value
    handleChange(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    root.classList.add(effectiveTheme);
  }, [theme, systemTheme]);

  return theme;
}
