
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
  
  // Use the useBrandLogo hook but don't automatically trigger updates based on website changes
  // Only pass website when manually triggering a refresh
  const { logoImage: fetchedLogoImage, isLoading, refreshLogo: brandRefreshLogo } = useBrandLogo(
    '' // Empty string means no automatic fetching
  );
  
  // Update the logo image when a new one is fetched
  useEffect(() => {
    if (fetchedLogoImage) {
      setLogoImage(fetchedLogoImage);
    }
  }, [fetchedLogoImage]);

  // Provide a manual refresh function that triggers logo fetch with the current website
  const refreshLogo = () => {
    if (currentWebsite) {
      // This will manually trigger a fetch with the current website
      brandRefreshLogo(currentWebsite);
    }
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
