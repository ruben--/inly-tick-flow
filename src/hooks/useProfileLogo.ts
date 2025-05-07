
import { useState, useEffect, useCallback, useRef } from "react";
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
  const [isManualRefresh, setIsManualRefresh] = useState(false);
  const websiteDebounceRef = useRef<number | null>(null);
  
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

  // Normalize website URL when it's set, with debouncing
  const setNormalizedWebsite = useCallback((website: string | null) => {
    // Clear existing debounce timer
    if (websiteDebounceRef.current) {
      window.clearTimeout(websiteDebounceRef.current);
    }
    
    if (!website) {
      setCurrentWebsite(null);
      return;
    }
    
    // Debounce website updates to avoid rapid state changes
    websiteDebounceRef.current = window.setTimeout(() => {
      // Ensure website has http/https prefix
      const normalizedWebsite = !/^https?:\/\//i.test(website) 
        ? `https://${website}` 
        : website;
        
      setCurrentWebsite(normalizedWebsite);
      websiteDebounceRef.current = null;
    }, 300);
  }, []);

  // Clean up any timers when unmounting
  useEffect(() => {
    return () => {
      if (websiteDebounceRef.current) {
        window.clearTimeout(websiteDebounceRef.current);
      }
    };
  }, []);

  // Provide a manual refresh function that triggers logo fetch with the current website
  const refreshLogo = useCallback(() => {
    if (currentWebsite) {
      setIsManualRefresh(true);
      brandRefreshLogo(currentWebsite);
    } else {
      setError("No website provided");
    }
  }, [currentWebsite, brandRefreshLogo]);

  // Automatic logo fetch on initial load or website change, but only if not blank
  useEffect(() => {
    if (currentWebsite && !logoImage && !isManualRefresh) {
      // Only trigger auto-fetch on first load or when logo image is null
      brandRefreshLogo(currentWebsite);
    }
    
    // Reset the manual refresh flag
    if (isManualRefresh) {
      setIsManualRefresh(false);
    }
  }, [currentWebsite, logoImage, brandRefreshLogo, isManualRefresh]);

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
