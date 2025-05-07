import { useState, useEffect } from "react";
import { fetchCompanyBranding, getBestLogo, extractDomain, fetchImageAsBase64 } from "@/utils/brandfetch";

export const useBrandLogo = (website: string) => {
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedDomain, setLastFetchedDomain] = useState<string | null>(null);
  
  useEffect(() => {
    // Skip if no website
    if (!website) {
      return;
    }

    const domain = extractDomain(website);
    
    // Skip if domain is invalid or unchanged
    if (!domain || domain === lastFetchedDomain) {
      return;
    }
    
    const fetchLogo = async () => {
      console.log("Fetching logo for domain:", domain);
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch branding data
        const brandingData = await fetchCompanyBranding(website);
        const logoUrl = getBestLogo(brandingData);
        
        if (logoUrl) {
          // Convert logo to base64 directly
          const base64Logo = await fetchImageAsBase64(logoUrl);
          setLogoImage(base64Logo);
        } else {
          setLogoImage(null);
        }
        
        // Store the domain we just fetched to avoid duplicate requests
        setLastFetchedDomain(domain);
      } catch (err) {
        console.error("Error in logo fetch process:", err);
        setError("Failed to fetch company logo");
        setLogoImage(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogo();
  }, [website, lastFetchedDomain]);

  // Add a manual refresh function that can accept a specific website URL
  const refreshLogo = (specificWebsite?: string) => {
    // If a specific website is provided, use that, otherwise reset the lastFetchedDomain
    if (specificWebsite) {
      // This will trigger a fetch for the specific website
      const domain = extractDomain(specificWebsite);
      if (domain !== lastFetchedDomain) {
        setLastFetchedDomain(null);
      }
    } else {
      // Just reset the domain to trigger a refetch with the current website
      setLastFetchedDomain(null);
    }
  };

  return {
    logoImage,
    isLoading,
    error,
    refreshLogo
  };
};
