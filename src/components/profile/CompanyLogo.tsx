
import React, { useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { fetchCompanyBranding, getBestLogo, extractDomain } from "@/utils/brandfetch";

interface CompanyLogoProps {
  website: string;
  companyName: string;
  className?: string;
  onLogoFound?: (logoUrl: string | null, imageData?: string | null) => void;
  logoUrl?: string | null;
  logoImage?: string | null;
  fetchAttempted?: boolean;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ 
  website, 
  companyName,
  className = "h-16 w-16",
  onLogoFound,
  logoUrl: initialLogoUrl,
  logoImage: initialLogoImage,
  fetchAttempted: initialFetchAttempted = false
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl || null);
  const [logoImage, setLogoImage] = useState<string | null>(initialLogoImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedDomain, setLastFetchedDomain] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(initialFetchAttempted);

  console.log("CompanyLogo initialized with:", { 
    initialLogoImage: !!initialLogoImage, 
    initialLogoUrl: !!initialLogoUrl, 
    fetchAttempted: initialFetchAttempted 
  });

  const initials = companyName
    ? companyName
        .split(' ')
        .map(word => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CO';

  // Fetch and store the image as base64 data when we have a logo URL
  const fetchAndStoreImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Convert blob to base64
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("Error fetching image:", err);
      return null;
    }
  };

  // First priority: Use the provided logo image if available
  useEffect(() => {
    console.log("Logo image effect triggered", { 
      initialLogoImage: !!initialLogoImage, 
      logoImage: !!logoImage 
    });
    
    if (initialLogoImage) {
      console.log("Using provided logo image");
      setLogoImage(initialLogoImage);
      
      // Only set the URL if provided and we don't have one already
      if (initialLogoUrl && !logoUrl) {
        setLogoUrl(initialLogoUrl);
      }
      
      setFetchAttempted(true); // No need to fetch
      return;
    }

    // If we have a logoUrl but no logoImage, fetch the image data
    if (logoUrl && !logoImage && !fetchAttempted) {
      console.log("Fetching image data from logo URL");
      const fetchImage = async () => {
        setIsLoading(true);
        const imageData = await fetchAndStoreImage(logoUrl);
        setLogoImage(imageData);
        setIsLoading(false);
        setFetchAttempted(true);
        
        // Call the callback when we get image data
        if (onLogoFound && imageData) {
          onLogoFound(logoUrl, imageData);
        }
      };
      
      fetchImage();
    }
  }, [logoUrl, logoImage, initialLogoImage, initialLogoUrl, onLogoFound, fetchAttempted]);

  // Only fetch a new logo if we don't have any image data yet and haven't tried fetching
  useEffect(() => {
    console.log("Logo fetch effect triggered", { 
      logoImage: !!logoImage, 
      fetchAttempted, 
      website 
    });
    
    // Skip fetch if we already have a logo image or have attempted to fetch
    if (logoImage || fetchAttempted) {
      console.log("Skipping fetch - already have image or attempted fetch");
      return;
    }

    // If we already have a logo URL from props, use it 
    if (initialLogoUrl) {
      console.log("Using provided logo URL");
      setLogoUrl(initialLogoUrl);
      setFetchAttempted(true);
      return;
    }

    // Skip if no website
    if (!website) {
      console.log("No website provided - skipping fetch");
      setLogoUrl(null);
      setFetchAttempted(true);
      if (onLogoFound) onLogoFound(null, null);
      return;
    }

    const fetchLogo = async () => {
      // Extract domain for comparison
      const domain = extractDomain(website);
      
      // Skip fetch if we've already fetched for this domain
      if (domain === lastFetchedDomain) {
        console.log("Already fetched this domain - skipping");
        setFetchAttempted(true);
        return;
      }
      
      console.log("Fetching logo for domain:", domain);
      setIsLoading(true);
      setError(null);
      
      try {
        const brandingData = await fetchCompanyBranding(website);
        const logo = getBestLogo(brandingData);
        setLogoUrl(logo);
        setLastFetchedDomain(domain);
        
        // If we found a logo, immediately fetch and store the image data
        if (logo) {
          console.log("Logo URL found:", logo);
          const imageData = await fetchAndStoreImage(logo);
          setLogoImage(imageData);
          if (onLogoFound) onLogoFound(logo, imageData);
        } else {
          console.log("No logo found for domain");
          if (onLogoFound) onLogoFound(null, null);
        }
      } catch (err) {
        console.error("Error fetching logo:", err);
        setError("Failed to fetch company logo");
        setLogoUrl(null);
        if (onLogoFound) onLogoFound(null, null);
      } finally {
        setIsLoading(false);
        setFetchAttempted(true);
      }
    };

    fetchLogo();
  }, [website, onLogoFound, initialLogoUrl, logoImage, lastFetchedDomain, fetchAttempted]);

  return (
    <div className="flex flex-col items-center">
      <div className={`border border-gray-200 overflow-hidden ${className}`}>
        <AspectRatio ratio={1}>
          {!isLoading && logoImage ? (
            <img 
              src={logoImage} 
              alt={companyName || "Company logo"} 
              className="object-contain p-1 w-full h-full"
            />
          ) : !isLoading && logoUrl ? (
            <img 
              src={logoUrl} 
              alt={companyName || "Company logo"} 
              className="object-contain p-1 w-full h-full"
              onLoad={async () => {
                // After successful load, convert to base64 for storage if we haven't done so already
                if (!logoImage) {
                  console.log("Image loaded successfully, converting to base64");
                  const imageData = await fetchAndStoreImage(logoUrl);
                  if (imageData) {
                    setLogoImage(imageData);
                    if (onLogoFound) onLogoFound(logoUrl, imageData);
                  }
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
              {isLoading ? (
                <div className="animate-pulse rounded-none bg-gray-300 h-full w-full" />
              ) : (
                <span className="text-lg font-medium">{initials}</span>
              )}
            </div>
          )}
        </AspectRatio>
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};
