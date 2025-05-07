
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
  const [error, setError] = useState<string | null>(null);
  
  // We use an empty string for the useBrandLogo hook to prevent automatic fetching
  // and only trigger fetches manually
  const { 
    logoImage: fetchedLogoImage, 
    isLoading, 
    error: brandError,
    refreshLogo: brandRefreshLogo 
  } = useBrandLogo('');
  
  // Update the logo image when a new one is successfully fetched
  useEffect(() => {
    if (fetchedLogoImage) {
      setLogoImage(fetchedLogoImage);
      setError(null);
    }
  }, [fetchedLogoImage]);
  
  // Update error state when brand hook reports an error
  useEffect(() => {
    if (brandError) {
      setError(brandError);
    }
  }, [brandError]);

  // Normalize website URL when it's set
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

  // Provide a manual refresh function that triggers logo fetch with the current website
  const refreshLogo = useCallback(() => {
    if (currentWebsite) {
      brandRefreshLogo(currentWebsite);
    } else {
      setError("No website provided");
    }
  }, [currentWebsite, brandRefreshLogo]);

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
