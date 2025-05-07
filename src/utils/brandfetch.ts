
// The API key should be stored securely, but for now we'll use it directly
const BRANDFETCH_API_KEY = "gXgvGENQaIPIWH7E/zWxO0wpwZDSdSr2BA3jgAUl0oM=";

export interface BrandfetchResponse {
  name?: string;
  domain?: string;
  logos?: {
    type?: string;
    theme?: string;
    formats?: {
      src?: string;
      format?: string;
      dimensions?: {
        height?: number;
        width?: number;
      };
      size?: number;
    }[];
  }[];
  icon?: {
    src?: string;
  };
}

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
 * Fetch company branding information from Brandfetch
 */
export const fetchCompanyBranding = async (website: string): Promise<BrandfetchResponse | null> => {
  try {
    if (!website) return null;
    
    const domain = extractDomain(website);
    if (!domain) return null;

    const response = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BRANDFETCH_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching brand data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching brand data:', error);
    return null;
  }
};

/**
 * Get the best logo from the Brandfetch response
 */
export const getBestLogo = (data: BrandfetchResponse | null): string | null => {
  if (!data || !data.logos || data.logos.length === 0) {
    return data?.icon?.src || null;
  }

  // First try to find a light theme logo with PNG format
  for (const logo of data.logos) {
    if (logo.theme === 'light' && logo.formats) {
      const pngFormat = logo.formats.find(format => format.format === 'png');
      if (pngFormat && pngFormat.src) {
        return pngFormat.src;
      }
    }
  }

  // If no light theme PNG found, try any logo with PNG format
  for (const logo of data.logos) {
    if (logo.formats) {
      const pngFormat = logo.formats.find(format => format.format === 'png');
      if (pngFormat && pngFormat.src) {
        return pngFormat.src;
      }
    }
  }

  // If no PNG found, return the first available logo or icon
  for (const logo of data.logos) {
    if (logo.formats && logo.formats.length > 0 && logo.formats[0].src) {
      return logo.formats[0].src;
    }
  }

  return data.icon?.src || null;
};

/**
 * Convert image URL to base64 data
 */
export const fetchImageAsBase64 = async (imageUrl: string): Promise<string | null> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};
