
import { useState, useEffect } from "react";
import { useBrandLogo } from "./useBrandLogo";
import { extractDomain } from "@/utils/brandfetch";

interface UseProfileLogoProps {
  initialWebsite?: string | null;
  initialLogoImage?: string | null;
}

export const useProfileLogo = ({
  initialWebsite = null,
  initialLogoImage = null
}: UseProfileLogoProps = {}) => {
  const [currentWebsite, setCurrentWebsite] = useState<string | null>(initialWebsite || null);
  const [logoImage, setLogoImage] = useState<string | null>(initialLogoImage || null);
  const [lastFetchedDomain, setLastFetchedDomain] = useState<string | null>(
    initialWebsite ? extractDomain(initialWebsite) : null
  );
  
  // Use the useBrandLogo hook to fetch logo when website changes
  const { logoImage: fetchedLogoImage, isLoading, refreshLogo } = useBrandLogo(
    currentWebsite && currentWebsite !== initialWebsite ? currentWebsite : ''
  );
  
  // Update the logo image when a new one is fetched
  useEffect(() => {
    if (fetchedLogoImage) {
      setLogoImage(fetchedLogoImage);
    }
  }, [fetchedLogoImage]);

  // Check if website domain has changed to manage fetching state
  useEffect(() => {
    if (currentWebsite) {
      const domain = extractDomain(currentWebsite);
      if (domain && domain !== lastFetchedDomain) {
        setLastFetchedDomain(domain);
      }
    }
  }, [currentWebsite, lastFetchedDomain]);

  // Provide a refresh function that resets the lastFetchedDomain and triggers a new fetch
  const refreshLogo = () => {
    setLastFetchedDomain(null);
  };

  return {
    currentWebsite,
    setCurrentWebsite,
    logoImage,
    setLogoImage,
    isLogoLoading: isLoading,
    refreshLogo
  };
};
