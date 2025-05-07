
import { useState } from "react";

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
  
  // Check if website has changed to determine if we need to fetch a new logo
  const isWebsiteChanged = (website: string) => {
    return website !== currentWebsite && website !== "";
  };

  return {
    currentWebsite,
    setCurrentWebsite,
    logoImage,
    setLogoImage,
    isWebsiteChanged
  };
};
