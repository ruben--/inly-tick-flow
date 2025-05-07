import { useState, useEffect, useCallback, useRef } from "react";
import { extractDomain } from "@/utils/brandfetch";
import { supabase } from "@/integrations/supabase/client";

// Add local storage caching for logos
const LOGO_CACHE_PREFIX = 'brand-logo-cache-';
const LOGO_CACHE_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 7 days

export const useBrandLogo = (website: string) => {
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedDomain, setLastFetchedDomain] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Check local storage cache for logo
  const getFromCache = useCallback((domain: string): string | null => {
    try {
      const cachedData = localStorage.getItem(`${LOGO_CACHE_PREFIX}${domain}`);
      if (!cachedData) return null;
      
      const { logo, timestamp } = JSON.parse(cachedData);
      const now = new Date().getTime();
      
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
  
  // Save logo to local storage cache
  const saveToCache = useCallback((domain: string, logoData: string) => {
    try {
      const cacheData = {
        logo: logoData,
        timestamp: new Date().getTime()
      };
      localStorage.setItem(`${LOGO_CACHE_PREFIX}${domain}`, JSON.stringify(cacheData));
    } catch (e) {
      console.error("Error saving to cache:", e);
    }
  }, []);
  
  // Memoize the fetch logo function to avoid recreation on each render
  const fetchLogo = useCallback(async (domainToFetch: string) => {
    if (!domainToFetch) return;
    
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    const requestId = Date.now().toString();
    
    console.log("Fetching logo for domain:", domainToFetch, "requestId:", requestId);
    setIsLoading(true);
    setError(null);
    
    try {
      // First check the cache
      const cachedLogo = getFromCache(domainToFetch);
      if (cachedLogo) {
        console.log("Using cached logo for:", domainToFetch);
        setLogoImage(cachedLogo);
        setLastFetchedDomain(domainToFetch);
        setIsLoading(false);
        return;
      }
      
      // If no cached logo, fetch from edge function
      const { data, error } = await supabase.functions.invoke('fetch-brand-logo', {
        body: { website: domainToFetch },
      });
      
      // Check if this request has been aborted or superseded
      if (abortControllerRef.current?.signal.aborted) {
        console.log("Request aborted for:", domainToFetch);
        return;
      }
      
      if (error || !data?.success) {
        console.error("Error in logo fetch process:", error || data?.error);
        setError(data?.error || "Failed to fetch company logo");
        setLogoImage(null);
      } else if (data.logoImage) {
        setLogoImage(data.logoImage);
        saveToCache(domainToFetch, data.logoImage);
        setLastFetchedDomain(domainToFetch);
      } else {
        setLogoImage(null);
        setError("No logo found for this company");
      }
    } catch (err) {
      // Ignore aborted request errors
      if (err.name === 'AbortError') {
        console.log("Request was aborted:", domainToFetch);
        return;
      }
      
      console.error("Error in logo fetch process:", err);
      setError("Failed to fetch company logo");
      setLogoImage(null);
    } finally {
      // Only update loading state if this is the latest request
      if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [getFromCache, saveToCache]);

  // Handle automatic fetching based on website prop
  useEffect(() => {
    // Skip if no website
    if (!website) {
      return;
    }

    const domain = extractDomain(website);
    
    // Skip if domain is invalid or unchanged
    if (!domain || domain === lastFetchedDomain) {
      return;
    }
    
    fetchLogo(domain);
    
    // Clean up function to abort any in-flight requests when the component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [website, lastFetchedDomain, fetchLogo]);

  // Add a manual refresh function that can accept a specific website URL
  const refreshLogo = useCallback((specificWebsite?: string) => {
    if (specificWebsite) {
      const domain = extractDomain(specificWebsite);
      if (domain) {
        // Remove from cache to force refresh
        try {
          localStorage.removeItem(`${LOGO_CACHE_PREFIX}${domain}`);
        } catch (e) {
          console.error("Error clearing cache:", e);
        }
        // Directly fetch with the provided website
        fetchLogo(domain);
      }
    } else if (website) {
      // Refresh with current website
      const domain = extractDomain(website);
      if (domain) {
        // Remove from cache to force refresh
        try {
          localStorage.removeItem(`${LOGO_CACHE_PREFIX}${domain}`);
        } catch (e) {
          console.error("Error clearing cache:", e);
        }
        fetchLogo(domain);
      }
    }
  }, [website, fetchLogo]);

  return {
    logoImage,
    isLoading,
    error,
    refreshLogo
  };
};
