
import { useState, useEffect } from "react";
import { useBrandLogo } from "./useBrandLogo";

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
  
  // Use the useBrandLogo hook to fetch logo when website changes
  const { logoImage: fetchedLogoImage, isLoading } = useBrandLogo(
    currentWebsite && currentWebsite !== initialWebsite ? currentWebsite : ''
  );
  
  // Update the logo image when a new one is fetched
  useEffect(() => {
    if (fetchedLogoImage) {
      setLogoImage(fetchedLogoImage);
    }
  }, [fetchedLogoImage]);

  return {
    currentWebsite,
    setCurrentWebsite,
    logoImage,
    setLogoImage,
    isLogoLoading: isLoading
  };
};
