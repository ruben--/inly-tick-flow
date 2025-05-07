
import { useState, useEffect, useCallback } from "react";
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
  const [currentWebsite, setCurrentWebsite] = useState<string | null>(initialWebsite);
  const [logoImage, setLogoImage] = useState<string | null>(initialLogoImage);
  
  // Use the brand logo hook for fetch handling
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

  // Normalize website URL
  const setNormalizedWebsite = useCallback((website: string | null) => {
    setCurrentWebsite(website ? website.trim() : null);
  }, []);

  return {
    currentWebsite,
    setCurrentWebsite: setNormalizedWebsite,
    logoImage,
    setLogoImage,
    isLogoLoading: isLoading,
    error,
    refreshLogo
  };
};
