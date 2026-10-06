import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { THEME_INIT_SCRIPT } from '../theme';

describe('theme bootstrap before hydration', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.colorScheme = '';
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.colorScheme = '';
  });

  it('applies saved dark mode synchronously even when the system is light', () => {
    window.localStorage.setItem('theme', 'dark');
    new Function(THEME_INIT_SCRIPT)();
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('respects saved light mode over a dark system preference', () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
    } as MediaQueryList);
    window.localStorage.setItem('theme', 'light');
    new Function(THEME_INIT_SCRIPT)();
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('defaults to dark on a first visit even when the system is light', () => {
    new Function(THEME_INIT_SCRIPT)();
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('falls back to dark if the stored value is invalid', () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
    } as MediaQueryList);
    window.localStorage.setItem('theme', 'invalid');
    new Function(THEME_INIT_SCRIPT)();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('still initializes when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage blocked', 'SecurityError');
    });
    expect(() => new Function(THEME_INIT_SCRIPT)()).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
