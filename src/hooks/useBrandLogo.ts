
import { useState, useEffect, useCallback, useRef } from "react";
import { extractDomain } from "@/utils/brandfetch";
import { supabase } from "@/integrations/supabase/client";

// Define constants for localStorage keys
const LOGO_CACHE_KEY = 'brand_logo_cache';
const LOGO_CACHE_TIMESTAMP_KEY = 'brand_logo_timestamp';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useBrandLogo = (website: string) => {
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchTimeoutRef = useRef<number | null>(null);
  const previousWebsiteRef = useRef<string | null>(null);

  // Clear logo when website changes completely
  useEffect(() => {
    if (previousWebsiteRef.current !== website) {
      setLogoImage(null);
      setError(null);
      previousWebsiteRef.current = website;
    }
  }, [website]);

  // Try to load cached logo on initial mount or when website changes
  useEffect(() => {
    // Reset states when website changes to empty
    if (!website) {
      setLogoImage(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const loadCachedLogo = () => {
      try {
        if (!website) return false;
        
        const domain = extractDomain(website);
        if (!domain) return false;
        
        const cacheKey = `${LOGO_CACHE_KEY}_${domain}`;
        const timestampKey = `${LOGO_CACHE_TIMESTAMP_KEY}_${domain}`;
        
        const cachedLogo = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(timestampKey);
        
        if (cachedLogo && cachedTimestamp) {
          const timestamp = parseInt(cachedTimestamp, 10);
          const now = Date.now();
          
          // Check if cache is still valid
          if (now - timestamp < CACHE_EXPIRY_TIME) {
            setLogoImage(cachedLogo);
            return true;
          }
        }
      } catch (err) {
        // Silently fail if localStorage is not available
        console.error("Error accessing localStorage:", err);
      }
      return false;
    };
    
    // If cached logo loaded successfully, don't fetch again
    if (!loadCachedLogo() && website) {
      const domain = extractDomain(website);
      if (domain) {
        // Clear any pending timeouts
        if (fetchTimeoutRef.current !== null) {
          window.clearTimeout(fetchTimeoutRef.current);
        }
        
        // Add a small delay to prevent rapid consecutive requests
        fetchTimeoutRef.current = window.setTimeout(() => {
          fetchLogo(domain);
        }, 300);
      }
    }
    
    return () => {
      // Cleanup on unmount or website change
      if (fetchTimeoutRef.current !== null) {
        window.clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [website]);

  // Cache logo in localStorage
  const cacheLogo = useCallback((domain: string, logo: string) => {
    try {
      const cacheKey = `${LOGO_CACHE_KEY}_${domain}`;
      const timestampKey = `${LOGO_CACHE_TIMESTAMP_KEY}_${domain}`;
      
      localStorage.setItem(cacheKey, logo);
      localStorage.setItem(timestampKey, Date.now().toString());
    } catch (err) {
      // Silently fail if localStorage is not available
      console.error("Error writing to localStorage:", err);
    }
  }, []);

  // Fetch the logo
  const fetchLogo = useCallback(async (domain: string) => {
    if (!domain) {
      setError("No domain provided");
      return;
    }
    
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Clear any pending timeout
    if (fetchTimeoutRef.current !== null) {
      window.clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch from edge function
      const response = await supabase.functions.invoke('fetch-brand-logo', {
        body: { website: domain }
      });
      
      if (controller.signal.aborted) return;
      
      if (response.error) {
        setError("Failed to fetch company logo");
        setIsLoading(false);
      } else if (response.data?.logoImage) {
        setLogoImage(response.data.logoImage);
        setIsLoading(false);
        // Cache the logo in localStorage
        cacheLogo(domain, response.data.logoImage);
      } else {
        setError("No logo found");
        setIsLoading(false);
      }
    } catch (err: any) {
      if (controller.signal.aborted) return;
      setError(err.message || "Failed to fetch logo");
      setIsLoading(false);
    }
  }, [cacheLogo]);

  // Manual refresh function
  const refreshLogo = useCallback(() => {
    if (!website) return;
    
    const domain = extractDomain(website);
    if (domain) {
      // Clear the cache for this domain when manually refreshing
      try {
        const cacheKey = `${LOGO_CACHE_KEY}_${domain}`;
        const timestampKey = `${LOGO_CACHE_TIMESTAMP_KEY}_${domain}`;
        
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(timestampKey);
      } catch (err) {
        // Silently fail if localStorage is not available
        console.error("Error clearing localStorage:", err);
      }
      
      // Reset state before fetching
      setLogoImage(null);
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
