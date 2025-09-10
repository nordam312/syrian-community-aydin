import DOMPurify from 'dompurify';
import type { Config } from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - The potentially dangerous HTML string
 * @param options - Optional DOMPurify configuration
 * @returns Sanitized HTML string
 */
export const sanitizeHTML = (dirty: string, options?: Config): string => {
  const result = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    ...options
  });
  return result.toString();
};

/**
 * Sanitize user input for display
 * @param input - User input string
 * @returns Sanitized string safe for display
 */
export const sanitizeInput = (input: string): string => {
  const result = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
  return result.toString();
};

/**
 * Sanitize URL to prevent javascript: and data: URLs
 * @param url - The URL to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export const sanitizeURL = (url: string): string => {
  try {
    const parsed = new URL(url);
    if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      return url;
    }
    return '';
  } catch {
    // If it's a relative URL, it's safe
    if (url.startsWith('/') || url.startsWith('#')) {
      return url;
    }
    return '';
  }
};

/**
 * Escape HTML entities in a string
 * @param text - Text to escape
 * @returns Escaped text
 */
export const escapeHTML = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};