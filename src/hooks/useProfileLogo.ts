
import { useState } from "react";

interface UseProfileLogoProps {
  initialLogoImage?: string | null;
  initialLogoUrl?: string | null;
  initialWebsite?: string | null;
}

export const useProfileLogo = ({
  initialLogoImage = null,
  initialLogoUrl = null,
  initialWebsite = null
}: UseProfileLogoProps = {}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl || null);
  const [logoImage, setLogoImage] = useState<string | null>(initialLogoImage || null);
  const [currentWebsite, setCurrentWebsite] = useState<string | null>(initialWebsite || null);
  const [fetchAttempted, setFetchAttempted] = useState(true);
  
  // Handle logo found from automatic fetch or manual upload
  const handleLogoFound = (foundLogoUrl: string | null, foundLogoImage: string | null) => {
    console.log("Logo found callback:", { foundLogoUrl, foundLogoImage: !!foundLogoImage });
    
    // Prioritize image data over URL
    if (foundLogoImage) {
      setLogoImage(foundLogoImage);
    }
    
    if (foundLogoUrl && !logoUrl) {
      setLogoUrl(foundLogoUrl);
    }
  };
  
  // Handle manual logo upload
  const handleLogoUpload = (imageData: string) => {
    console.log("Logo manually uploaded");
    setLogoImage(imageData);
    // Clear the URL since we're using an uploaded image instead
    setLogoUrl(null);
  };

  // Check if website has changed to determine if we need to fetch a new logo
  const isWebsiteChanged = (website: string) => {
    return website !== currentWebsite && website !== "";
  };

  return {
    logoUrl,
    logoImage,
    currentWebsite,
    fetchAttempted,
    setCurrentWebsite,
    handleLogoFound,
    handleLogoUpload,
    isWebsiteChanged
  };
};
