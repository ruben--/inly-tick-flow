import { useState, useEffect, useRef } from "react";
import { 
  fetchCompanyBranding, 
  getBestLogo, 
  extractDomain, 
  cacheLogoInfo, 
  getCachedLogoInfo, 
  isValidUrl
} from "@/utils/brandfetch";

interface UseCompanyLogoProps {
  website: string;
  initialLogoUrl?: string | null;
  initialLogoImage?: string | null;
  initialFetchAttempted?: boolean;
  onLogoFound?: (logoUrl: string | null, imageData: string | null) => void;
}

export const useCompanyLogo = ({
  website,
  initialLogoUrl = null,
  initialLogoImage = null,
  initialFetchAttempted = false,
  onLogoFound
}: UseCompanyLogoProps) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl);
  const [logoImage, setLogoImage] = useState<string | null>(initialLogoImage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedDomain, setLastFetchedDomain] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(initialFetchAttempted);
  
  // Keep track of the current fetch request to avoid race conditions
  const currentFetchRef = useRef<AbortController | null>(null);
  
  // Check if the website is valid
  const isValidWebsite = website ? isValidUrl(website) : false;
  
  // Extract domain for comparison and caching
  const domain = website ? extractDomain(website) : null;
  
  // If we have a logoUrl but no logoImage, fetch the image data
  useEffect(() => {
    if (initialLogoImage) {
      console.log("Using provided logo image from props");
      setLogoImage(initialLogoImage);
      
      // Only set the URL if provided and we don't have one already
      if (initialLogoUrl && !logoUrl) {
        setLogoUrl(initialLogoUrl);
      }
      
      setFetchAttempted(true); // No need to fetch
      return;
    }

    // If we have a logoUrl but no logoImage, use the logoUrl directly
    // (Our edge function now returns the image directly)
    if (logoUrl && !logoImage && !fetchAttempted) {
      console.log("Setting logo image from URL");
      setLogoImage(logoUrl);
      setFetchAttempted(true);
      
      // Call the callback when we get image data
      if (onLogoFound && logoUrl) {
        onLogoFound(logoUrl, logoUrl);
      }
    }
  }, [logoUrl, logoImage, initialLogoImage, initialLogoUrl, onLogoFound, fetchAttempted]);

  // Only fetch a new logo if we don't have any image data yet and haven't tried fetching
  useEffect(() => {
    // Skip fetch if we already have a logo image or have attempted to fetch
    if (logoImage || fetchAttempted || !isValidWebsite) {
      return;
    }

    // If we already have a logo URL from props, use it 
    if (initialLogoUrl) {
      console.log("Using provided logo URL");
      setLogoUrl(initialLogoUrl);
      setFetchAttempted(true);
      return;
    }

    // Skip if no website or invalid website
    if (!website || !domain) {
      setLogoUrl(null);
      setFetchAttempted(true);
      if (onLogoFound) onLogoFound(null, null);
      return;
    }
    
    const fetchLogo = async () => {
      // Check cache first
      const cachedLogo = getCachedLogoInfo(domain);
      if (cachedLogo && cachedLogo.logoImage) {
        console.log("Using cached logo for domain:", domain);
        setLogoUrl(cachedLogo.logoUrl);
        setLogoImage(cachedLogo.logoImage);
        setLastFetchedDomain(domain);
        setFetchAttempted(true);
        if (onLogoFound) onLogoFound(cachedLogo.logoUrl, cachedLogo.logoImage);
        return;
      }
      
      // Skip fetch if we've already fetched for this domain
      if (domain === lastFetchedDomain) {
        console.log("Already fetched this domain - skipping");
        setFetchAttempted(true);
        return;
      }
      
      console.log("Fetching logo for domain:", domain);
      setIsLoading(true);
      setError(null);
      
      // Cancel any in-flight requests
      if (currentFetchRef.current) {
        currentFetchRef.current.abort();
      }
      
      // Create new abort controller for this request
      const abortController = new AbortController();
      currentFetchRef.current = abortController;
      
      try {
        const brandingData = await fetchCompanyBranding(website);
        
        // Check if this request was cancelled
        if (abortController.signal.aborted) {
          return;
        }
        
        const logo = getBestLogo(brandingData);
        setLogoUrl(logo);
        setLogoImage(logo); // The edge function returns the base64 image directly
        setLastFetchedDomain(domain);
        
        // Cache the logo
        if (logo && domain) {
          cacheLogoInfo(domain, logo, logo);
        }
        
        // Notify parent component
        if (onLogoFound) {
          onLogoFound(logo, logo);
        }
      } catch (err) {
        console.error("Error fetching logo:", err);
        setError("Failed to fetch company logo");
        setLogoUrl(null);
        if (onLogoFound) onLogoFound(null, null);
      } finally {
        // Clear the reference to avoid memory leaks
        if (currentFetchRef.current === abortController) {
          currentFetchRef.current = null;
        }
        
        setIsLoading(false);
        setFetchAttempted(true);
      }
    };

    fetchLogo();
  }, [website, domain, onLogoFound, initialLogoUrl, logoImage, lastFetchedDomain, fetchAttempted, isValidWebsite]);

  const handleRetryFetch = () => {
    setFetchAttempted(false);
    setLogoImage(null);
    setLogoUrl(null);
    setError(null);
    setLastFetchedDomain(null);
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
