
import { useState, useEffect, useCallback } from "react";
import { fetchCompanyBranding, getBestLogo, extractDomain, fetchImageAsBase64 } from "@/utils/brandfetch";

export const useBrandLogo = (website: string) => {
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedDomain, setLastFetchedDomain] = useState<string | null>(null);
  
  // Memoize the fetch logo function to avoid recreation on each render
  const fetchLogo = useCallback(async (domainToFetch: string) => {
    if (!domainToFetch) return;
    
    console.log("Fetching logo for domain:", domainToFetch);
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch branding data
      const brandingData = await fetchCompanyBranding(domainToFetch);
      const logoUrl = getBestLogo(brandingData);
      
      if (logoUrl) {
        // Convert logo to base64 directly
        const base64Logo = await fetchImageAsBase64(logoUrl);
        setLogoImage(base64Logo);
      } else {
        setLogoImage(null);
      }
      
      // Store the domain we just fetched to avoid duplicate requests
      setLastFetchedDomain(domainToFetch);
    } catch (err) {
      console.error("Error in logo fetch process:", err);
      setError("Failed to fetch company logo");
      setLogoImage(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle automatic fetching based on website prop
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
    
    fetchLogo(domain);
  }, [website, lastFetchedDomain, fetchLogo]);

  // Add a manual refresh function that can accept a specific website URL
  const refreshLogo = useCallback((specificWebsite?: string) => {
    if (specificWebsite) {
      const domain = extractDomain(specificWebsite);
      if (domain) {
        // Directly fetch with the provided website
        fetchLogo(domain);
      }
    } else if (website) {
      // Refresh with current website
      const domain = extractDomain(website);
      if (domain) {
        fetchLogo(domain);
      }
    }
  }, [website, fetchLogo]);

  return {
    logoImage,
    isLoading,
    error,
    refreshLogo
  };
};
