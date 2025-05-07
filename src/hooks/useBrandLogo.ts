
import { useState, useEffect } from "react";
import { fetchCompanyBranding, getBestLogo, extractDomain } from "@/utils/brandfetch";

export const useBrandLogo = (website: string) => {
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedDomain, setLastFetchedDomain] = useState<string | null>(null);
  
  useEffect(() => {
    // Skip if no website
    if (!website) {
      setLogoImage(null);
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
        // Fetch branding data
        const brandingData = await fetchCompanyBranding(website);
        const logoUrl = getBestLogo(brandingData);
        
        // If we found a logo URL, fetch the actual image data
        if (logoUrl) {
          try {
            const response = await fetch(logoUrl);
            const blob = await response.blob();
            
            // Convert blob to base64
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              const base64data = reader.result as string;
              setLogoImage(base64data);
            };
          } catch (imgError) {
            console.error("Error fetching logo image:", imgError);
            setLogoImage(null);
          }
        }
        
        setLastFetchedDomain(domain);
      } catch (err) {
        console.error("Error fetching logo:", err);
        setError("Failed to fetch company logo");
        setLogoImage(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogo();
  }, [website, lastFetchedDomain]);

  return {
    logoImage,
    isLoading,
    error
  };
};
