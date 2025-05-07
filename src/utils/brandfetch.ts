
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

/**
 * Fetch company branding information from Brandfetch edge function
 */
export const fetchCompanyBranding = async (website: string): Promise<any> => {
  try {
    if (!website) return null;
    
    const domain = extractDomain(website);
    if (!domain) return null;
    
    // Call the Supabase edge function to fetch the logo
    const { data, error } = await fetch('/api/fetch-brand-logo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ website: domain }),
    }).then(res => res.json());
    
    if (error) {
      console.error('Error fetching brand data:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchCompanyBranding:', error);
    return null;
  }
};

/**
 * Get the best logo from the Brandfetch response
 * Since we're now using our Supabase edge function, we just return the logo from the response
 */
export const getBestLogo = (data: any): string | null => {
  if (!data || !data.logoImage) {
    return null;
  }
  
  return data.logoImage;
};

/**
 * Cache logo information in local storage to reduce API calls
 */
export const cacheLogoInfo = (domain: string, logoUrl: string | null, logoImage: string | null) => {
  if (!domain) return;
  
  try {
    const cacheData = {
      logoUrl,
      logoImage,
      timestamp: Date.now()
    };
    
    localStorage.setItem(`logo_cache_${domain}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching logo info:', error);
  }
};

/**
 * Get cached logo information from local storage
 * Returns null if cache doesn't exist or is expired
 */
export const getCachedLogoInfo = (domain: string, maxAgeMs = 24 * 60 * 60 * 1000) => {
  if (!domain) return null;
  
  try {
    const cacheJson = localStorage.getItem(`logo_cache_${domain}`);
    if (!cacheJson) return null;
    
    const cache = JSON.parse(cacheJson);
    const now = Date.now();
    
    // Check if cache is expired (default: 24 hours)
    if (now - cache.timestamp > maxAgeMs) {
      localStorage.removeItem(`logo_cache_${domain}`);
      return null;
    }
    
    return {
      logoUrl: cache.logoUrl,
      logoImage: cache.logoImage
    };
  } catch (error) {
    console.error('Error getting cached logo info:', error);
    return null;
  }
};
