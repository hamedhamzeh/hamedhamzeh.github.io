'use client';

import { useCallback, useEffect, useState } from 'react';

import { MoonIcon, SunIcon } from '@/components/Icons';
import { DEFAULT_THEME } from '@/lib/theme';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem('theme');
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
    if (stored === 'light' || stored === 'dark') {
      setIsDark(stored === 'dark');
    } else {
      setIsDark(DEFAULT_THEME === 'dark');
    }
  }, []);

  useEffect(() => {
    if (isDark === null) return;
    document.documentElement.setAttribute(
      'data-theme',
      isDark ? 'dark' : 'light',
    );
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    try {
      window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {
      // Keep the toggle usable even when the preference cannot be persisted.
    }
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  if (isDark === null) {
    return <div className="theme-toggle-placeholder" />;
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-toggle-icon">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}
