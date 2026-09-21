/**
 * Shared utility functions and constants
 */

// Site configuration
export const SITE_URL = 'https://hamedhamzeh.github.io';
export const AUTHOR_NAME = 'Hamed Hamzeh';
export const TWITTER_HANDLE = '@hamedhamzeh';
export const SITE_IMAGE_PATH = '/images/me.jpg';
export const SITE_IMAGE_DIMENSIONS = {
  width: 640,
  height: 640,
} as const;

// Canonical one-line bio, shared across page metadata, OpenGraph, and JSON-LD.
export const SITE_DESCRIPTION =
  'Computer Vision Developer with experience building deep-learning systems for industrial monitoring, sports analytics, robotics, and medical imaging, with a growing focus on MLOps and reliable AI deployment.';
// Image dimension constants
export const AVATAR_SIZE = {
  hero: 120,
  footer: 80,
  sidebar: 200,
} as const;

export const PROJECT_IMAGE = {
  width: 600,
  height: 400,
} as const;

/**
 * Formats a date string to a human-readable format.
 * Parses as UTC to avoid timezone shifts.
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  // Parse as UTC to avoid timezone shifts
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
