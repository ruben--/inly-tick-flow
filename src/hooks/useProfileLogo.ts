
import { useState } from "react";

interface UseProfileLogoProps {
  initialWebsite?: string | null;
}

export const useProfileLogo = ({
  initialWebsite = null
}: UseProfileLogoProps = {}) => {
  const [currentWebsite, setCurrentWebsite] = useState<string | null>(initialWebsite || null);
  
  // Check if website has changed to determine if we need to fetch a new logo
  const isWebsiteChanged = (website: string) => {
    return website !== currentWebsite && website !== "";
  };

  return {
    currentWebsite,
    setCurrentWebsite,
    isWebsiteChanged
  };
};
