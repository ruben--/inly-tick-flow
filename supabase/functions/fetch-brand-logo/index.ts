
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// The API key is securely stored as a Supabase secret
const BRANDFETCH_API_KEY = Deno.env.get("BRANDFETCH_API_KEY") || "";

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { website } = await req.json();
    
    if (!website) {
      return new Response(
        JSON.stringify({ error: "No website provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Extract domain from website
    const domain = extractDomain(website);
    if (!domain) {
      return new Response(
        JSON.stringify({ error: "Invalid website URL" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Fetching logo for domain: ${domain}`);
    
    // Fetch brand data
    const brandData = await fetchCompanyBranding(domain);
    
    if (!brandData) {
      return new Response(
        JSON.stringify({ error: "Could not fetch brand data" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    // Get the best logo URL
    const logoUrl = getBestLogo(brandData);
    
    if (!logoUrl) {
      return new Response(
        JSON.stringify({ error: "No logo found for this domain" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    // Fetch and convert the logo to base64
    const base64Logo = await fetchImageAsBase64(logoUrl);
    
    if (!base64Logo) {
      return new Response(
        JSON.stringify({ error: "Failed to process logo image" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        logoImage: base64Logo,
        domain: domain
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in fetch-brand-logo function:", error);
    
    return new Response(
      JSON.stringify({ error: `Failed to fetch logo: ${error.message}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Helper functions below
interface BrandfetchResponse {
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

// Extract domain from URL
function extractDomain(url: string): string {
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
}

// Fetch company branding information from Brandfetch
async function fetchCompanyBranding(domain: string): Promise<BrandfetchResponse | null> {
  try {
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
}

// Get the best logo from the Brandfetch response
function getBestLogo(data: BrandfetchResponse | null): string | null {
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
}

// Convert image URL to base64 data
async function fetchImageAsBase64(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const mimeType = response.headers.get('content-type') || 'image/png';
    
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
}
