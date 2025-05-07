
import { useState, useEffect, useCallback } from "react";
import { useBrandLogo } from "./useBrandLogo";
import { extractDomain, isValidUrl } from "@/utils/brandfetch";

interface UseProfileLogoProps {
  initialWebsite?: string | null;
  initialLogoImage?: string | null;
}

export const useProfileLogo = ({
  initialWebsite = null,
  initialLogoImage = null
}: UseProfileLogoProps = {}) => {
  const [currentWebsite, setCurrentWebsite] = useState<string | null>(initialWebsite);
  const [logoImage, setLogoImage] = useState<string | null>(initialLogoImage);
  const [manualFetch, setManualFetch] = useState(false);
  
  // Use the brand logo hook for consistent logo fetching
  const { 
    logoImage: fetchedLogoImage, 
    isLoading, 
    error,
    refreshLogo 
  } = useBrandLogo(currentWebsite || '');
  
  // Update local state when fetched logo changes
  useEffect(() => {
    if (fetchedLogoImage) {
      setLogoImage(fetchedLogoImage);
    }
  }, [fetchedLogoImage]);

  // Handle website URL normalization
  const setNormalizedWebsite = useCallback((website: string | null) => {
    if (!website) {
      setCurrentWebsite(null);
      return;
    }
    
    // Ensure website has http/https prefix
    const normalizedWebsite = !/^https?:\/\//i.test(website) 
      ? `https://${website}` 
      : website;
      
    setCurrentWebsite(normalizedWebsite);
  }, []);

  // Manual refresh function that uses the brand logo hook
  const handleRefreshLogo = useCallback(() => {
    if (!currentWebsite) return;
    
    setManualFetch(true);
    refreshLogo();
  }, [currentWebsite, refreshLogo]);

  // Auto-fetch logo on initial load if we have a website but no logo
  useEffect(() => {
    if (currentWebsite && !logoImage && !manualFetch) {
      refreshLogo();
    }
  }, [currentWebsite, logoImage, refreshLogo, manualFetch]);

  return {
    currentWebsite,
    setCurrentWebsite: setNormalizedWebsite,
    logoImage,
    setLogoImage,
    isLogoLoading: isLoading,
    error,
    refreshLogo: handleRefreshLogo
  };
};
