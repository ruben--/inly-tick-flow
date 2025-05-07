
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
  
  // Clear cache for a specific domain
  const clearCacheForDomain = useCallback((domain: string) => {
    try {
      localStorage.removeItem(`${LOGO_CACHE_PREFIX}${domain}`);
      console.log(`Cache cleared for domain: ${domain}`);
    } catch (e) {
      console.error("Error clearing cache:", e);
    }
  }, []);
  
  // Memoize the fetch logo function to avoid recreation on each render
  const fetchLogo = useCallback(async (domainToFetch: string, forceRefresh = false) => {
    if (!domainToFetch) return;
    
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    const requestId = Date.now().toString();
    
    console.log("Fetching logo for domain:", domainToFetch, "requestId:", requestId, "forceRefresh:", forceRefresh);
    setIsLoading(true);
    setError(null);
    
    try {
      // Check the cache only if we're not forcing a refresh
      if (!forceRefresh) {
        const cachedLogo = getFromCache(domainToFetch);
        if (cachedLogo) {
          console.log("Using cached logo for:", domainToFetch);
          setLogoImage(cachedLogo);
          setLastFetchedDomain(domainToFetch);
          setIsLoading(false);
          return;
        }
      } else {
        // Clear the cache if we're forcing a refresh
        clearCacheForDomain(domainToFetch);
      }
      
      // If no cached logo or forcing refresh, fetch from edge function
      const response = await supabase.functions.invoke('fetch-brand-logo', {
        body: { website: domainToFetch },
      });
      
      // Check if this request has been aborted or superseded
      if (abortControllerRef.current?.signal.aborted) {
        console.log("Request aborted for:", domainToFetch);
        return;
      }
      
      if (response.error) {
        console.error("Logo fetch error:", response.error);
        
        // Provide more specific error messages based on error status
        if (response.error.toString().includes("403")) {
          setError("API authorization failed. Please try again later.");
        } else if (response.error.toString().includes("404")) {
          setError("No logo found for this website");
        } else {
          setError("Failed to fetch logo. Please try again later.");
        }
        
        setLogoImage(null);
      } else if (response.data?.logoImage) {
        const logoWithTimestamp = response.data.logoImage + (response.data.logoImage.includes('?') ? '&' : '?') + `t=${Date.now()}`;
        setLogoImage(logoWithTimestamp);
        saveToCache(domainToFetch, response.data.logoImage);
        setLastFetchedDomain(domainToFetch);
      } else {
        setLogoImage(null);
        setError(response.data?.error || "No logo found for this website");
      }
    } catch (err: any) {
      // Ignore aborted request errors
      if (err.name === 'AbortError') {
        console.log("Request was aborted:", domainToFetch);
        return;
      }
      
      console.error("Error in logo fetch process:", err);
      setError("Failed to fetch company logo. Please try again later.");
      setLogoImage(null);
    } finally {
      // Only update loading state if this is the latest request
      if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [getFromCache, saveToCache, clearCacheForDomain]);

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

  // Add a manual refresh function that can accept a specific website URL and force refresh
  const refreshLogo = useCallback((specificWebsite?: string) => {
    if (specificWebsite) {
      const domain = extractDomain(specificWebsite);
      if (domain) {
        // Force refresh by passing true as second parameter
        fetchLogo(domain, true);
      }
    } else if (website) {
      // Refresh with current website
      const domain = extractDomain(website);
      if (domain) {
        // Force refresh by passing true as second parameter
        fetchLogo(domain, true);
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
