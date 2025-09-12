import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  useEffect(() => {
    const root = window.document.documentElement;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      themeColorMeta?.setAttribute('content', '#0f172a'); // dark background
    } else {
      root.classList.remove('dark');
      themeColorMeta?.setAttribute('content', '#ffffff'); // light background
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, setTheme, toggleTheme };
}
