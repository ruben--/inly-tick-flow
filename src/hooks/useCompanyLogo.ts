
import { useState, useEffect } from "react";
import { extractDomain, isValidUrl } from "@/utils/brandfetch";
import { useBrandLogo } from "./useBrandLogo";

interface UseCompanyLogoProps {
  website: string;
  initialLogoUrl?: string | null;
  initialLogoImage?: string | null;
  onLogoFound?: (logoUrl: string | null, imageData: string | null) => void;
}

export const useCompanyLogo = ({
  website,
  initialLogoUrl = null,
  initialLogoImage = null,
  onLogoFound
}: UseCompanyLogoProps) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl);
  const [logoImage, setLogoImage] = useState<string | null>(initialLogoImage);
  const [fetchAttempted, setFetchAttempted] = useState(!!initialLogoImage);
  
  // Check if the website is valid
  const isValidWebsite = website ? isValidUrl(website) : false;
  
  // Use our central brand logo hook
  const { logoImage: fetchedLogo, isLoading, error } = useBrandLogo(isValidWebsite ? website : '');
  
  // Update the logo when the fetched logo changes
  useEffect(() => {
    if (fetchedLogo && !logoImage) {
      setLogoUrl(fetchedLogo);
      setLogoImage(fetchedLogo);
      setFetchAttempted(true);
      
      if (onLogoFound) {
        onLogoFound(fetchedLogo, fetchedLogo);
      }
    }
  }, [fetchedLogo, logoImage, onLogoFound]);
  
  // Set initial logo if provided
  useEffect(() => {
    if (initialLogoImage && !logoImage) {
      setLogoImage(initialLogoImage);
      setLogoUrl(initialLogoUrl || initialLogoImage);
      setFetchAttempted(true);
    }
  }, [initialLogoImage, initialLogoUrl, logoImage]);

  const handleRetryFetch = () => {
    setFetchAttempted(false);
    setLogoImage(null);
    setLogoUrl(null);
  };

  return {
    logoUrl,
    logoImage,
    isLoading,
    error,
    fetchAttempted,
    handleRetryFetch,
    isValidWebsite
  };
};
