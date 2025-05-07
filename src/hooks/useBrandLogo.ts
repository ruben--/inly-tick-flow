
import { useState, useEffect } from "react";
import { fetchCompanyBranding, getBestLogo, extractDomain } from "@/utils/brandfetch";

export const useBrandLogo = (website: string) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedDomain, setLastFetchedDomain] = useState<string | null>(null);
  
  useEffect(() => {
    // Skip if no website
    if (!website) {
      setLogoUrl(null);
      return;
    }

    const fetchLogo = async () => {
      // Extract domain for comparison
      const domain = extractDomain(website);
      
      // Skip fetch if we've already fetched for this domain
      if (domain === lastFetchedDomain) {
        return;
      }
      
      console.log("Fetching logo for domain:", domain);
      setIsLoading(true);
      setError(null);
      
      try {
        const brandingData = await fetchCompanyBranding(website);
        const logo = getBestLogo(brandingData);
        setLogoUrl(logo);
        setLastFetchedDomain(domain);
      } catch (err) {
        console.error("Error fetching logo:", err);
        setError("Failed to fetch company logo");
        setLogoUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogo();
  }, [website, lastFetchedDomain]);

  return {
    logoUrl,
    isLoading,
    error
  };
};
