
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
  const fetchTimeoutRef = useRef<number | null>(null);
  
  // Get cached logo, if available
  const getFromCache = useCallback((domain: string): string | null => {
    try {
      const cachedData = localStorage.getItem(`${LOGO_CACHE_PREFIX}${domain}`);
      if (!cachedData) return null;
      
      const { logo, timestamp } = JSON.parse(cachedData);
      
      if (Date.now() - timestamp > LOGO_CACHE_EXPIRATION) {
        localStorage.removeItem(`${LOGO_CACHE_PREFIX}${domain}`);
        return null;
      }
      
      return logo;
    } catch (e) {
      console.error("Cache error:", e);
      return null;
    }
  }, []);
  
  // Save to cache
  const saveToCache = useCallback((domain: string, logoData: string) => {
    if (!domain || !logoData) return;
    
    try {
      localStorage.setItem(`${LOGO_CACHE_PREFIX}${domain}`, JSON.stringify({
        logo: logoData,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.error("Cache save error:", e);
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
      // Check cache first
      const cachedLogo = getFromCache(domain);
      if (cachedLogo) {
        setLogoImage(cachedLogo);
        setIsLoading(false);
        return;
      }
      
      // Fetch from edge function
      const response = await supabase.functions.invoke('fetch-brand-logo', {
        body: { website: domain }
      });
      
      if (controller.signal.aborted) return;
      
      if (response.error) {
        setError("Failed to fetch company logo");
      } else if (response.data?.logoImage) {
        setLogoImage(response.data.logoImage);
        saveToCache(domain, response.data.logoImage);
      } else {
        setError("No logo found");
      }
    } catch (err: any) {
      if (controller.signal.aborted) return;
      setError(err.message || "Failed to fetch logo");
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [getFromCache, saveToCache]);

  // Fetch logo when website changes
  useEffect(() => {
    if (!website) {
      setLogoImage(null);
      setError(null);
      return;
    }

    const domain = extractDomain(website);
    if (!domain) {
      setError("Invalid URL");
      return;
    }
    
    // Add a small delay to prevent rapid consecutive requests
    fetchTimeoutRef.current = window.setTimeout(() => {
      fetchLogo(domain);
    }, 300);
    
    return () => {
      if (fetchTimeoutRef.current !== null) {
        window.clearTimeout(fetchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [website, fetchLogo]);

  // Manual refresh function
  const refreshLogo = useCallback(() => {
    if (!website) return;
    
    const domain = extractDomain(website);
    if (domain) {
      try {
        localStorage.removeItem(`${LOGO_CACHE_PREFIX}${domain}`);
      } catch (e) {
        console.error("Cache clear error:", e);
      }
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
