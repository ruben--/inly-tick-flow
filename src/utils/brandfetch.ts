
/**
 * Extract domain from URL
 */
export const extractDomain = (url: string): string => {
  try {
    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    console.error('Error extracting domain:', error);
    return '';
  }
};

/**
 * Normalize a website URL by ensuring it has http/https prefix
 */
export const normalizeWebsiteUrl = (url: string): string => {
  if (!url) return '';
  return !/^https?:\/\//i.test(url) ? `https://${url}` : url;
};

/**
 * Validate if a string is a properly formatted URL
 */
export const isValidUrl = (str: string): boolean => {
  try {
    const url = new URL(normalizeWebsiteUrl(str));
    return url.hostname.includes('.');
  } catch (e) {
    return false;
  }
};

/**
 * Generate a placeholder text for when a logo is not available
 */
export const generateInitials = (text: string): string => {
  if (!text) return 'CO';
  
  return text
    .split(' ')
    .map(word => word?.[0] || '')
    .slice(0, 2)
    .join('')
    .toUpperCase();
};
