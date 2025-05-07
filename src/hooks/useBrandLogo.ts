
import { useState, useEffect, useCallback, useRef } from "react";
import { extractDomain } from "@/utils/brandfetch";
import { supabase } from "@/integrations/supabase/client";

// Define cache constants
const LOGO_CACHE_PREFIX = 'brand-logo-';
const LOGO_CACHE_EXPIRATION = 1000 * 60 * 60 * 24; // 1 day

export const useBrandLogo = (website: string) => {
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  
  // Get cached logo, if available
  const getFromCache = useCallback((domain: string): string | null => {
    try {
      const cachedData = localStorage.getItem(`${LOGO_CACHE_PREFIX}${domain}`);
      if (!cachedData) return null;
      
      const { logo, timestamp } = JSON.parse(cachedData);
      const now = Date.now();
      
      // Check if cache is expired
      if (now - timestamp > LOGO_CACHE_EXPIRATION) {
        localStorage.removeItem(`${LOGO_CACHE_PREFIX}${domain}`);
        return null;
      }
      
      return logo;
    } catch (e) {
      console.error("Error reading from cache:", e);
      return null;
    }
  }, []);
  
  // Save to cache
  const saveToCache = useCallback((domain: string, logoData: string) => {
    if (!domain || !logoData) return;
    
    try {
      const cacheData = {
        logo: logoData,
        timestamp: Date.now()
      };
      localStorage.setItem(`${LOGO_CACHE_PREFIX}${domain}`, JSON.stringify(cacheData));
    } catch (e) {
      console.error("Error saving to cache:", e);
    }
  }, []);

  // Fetch the logo
  const fetchLogo = useCallback(async (domainToFetch: string) => {
    if (!domainToFetch) {
      setError("No domain provided");
      return;
    }
    
    // Prevent multiple fetches within a short timeframe (500ms)
    const now = Date.now();
    if (now - lastFetchTime < 500) {
      console.log("Throttling logo fetch requests");
      return;
    }
    setLastFetchTime(now);
    
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Create new controller
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    console.log("Fetching logo for domain:", domainToFetch);
    setIsLoading(true);
    setError(null);
    
    try {
      // Check cache first
      const cachedLogo = getFromCache(domainToFetch);
      if (cachedLogo) {
        console.log("Using cached logo for:", domainToFetch);
        setLogoImage(cachedLogo);
        setIsLoading(false);
        return;
      }
      
      // Fetch from edge function
      const response = await supabase.functions.invoke('fetch-brand-logo', {
        body: { website: domainToFetch }
      });
      
      // Check if this request was aborted
      if (controller.signal.aborted) {
        console.log("Request was aborted");
        return;
      }
      
      if (response.error) {
        console.error("Logo fetch error:", response.error);
        setError("Failed to fetch company logo");
      } else if (response.data?.logoImage) {
        // Add timestamp to prevent browser caching
        const responseImage = response.data.logoImage;
        setLogoImage(responseImage);
        saveToCache(domainToFetch, responseImage);
      } else {
        setError("No logo found for this website");
      }
    } catch (err: any) {
      if (controller.signal.aborted) return;
      
      console.error("Error fetching logo:", err);
      setError(err.message || "Failed to fetch logo");
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [getFromCache, saveToCache, lastFetchTime]);

  // Fetch logo automatically when website changes
  useEffect(() => {
    if (!website) {
      setLogoImage(null);
      setError(null);
      return;
    }

    const domain = extractDomain(website);
    if (!domain) {
      setError("Invalid website URL");
      return;
    }
    
    fetchLogo(domain);
    
    // Clean up on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [website, fetchLogo]);

  // Manual refresh function
  const refreshLogo = useCallback(() => {
    if (!website) {
      setError("No website provided");
      return;
    }
    
    const domain = extractDomain(website);
    if (domain) {
      // Clear the cache for this domain
      try {
        localStorage.removeItem(`${LOGO_CACHE_PREFIX}${domain}`);
      } catch (e) {
        console.error("Error clearing cache:", e);
      }
      
      // Fetch fresh logo
      fetchLogo(domain);
    }
  }, [website, fetchLogo]);

  return {
    logoImage,
    isLoading,
    error,
    refreshLogo
  };
};
