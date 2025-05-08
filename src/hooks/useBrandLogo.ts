
import { useState, useEffect, useCallback, useRef } from "react";
import { extractDomain } from "@/utils/brandfetch";
import { supabase } from "@/integrations/supabase/client";

// Define constants for localStorage keys
const LOGO_CACHE_KEY = 'brand_logo_cache';
const LOGO_CACHE_TIMESTAMP_KEY = 'brand_logo_timestamp';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// In-memory cache for the current session
const logoCache = new Map<string, { logo: string, timestamp: number }>();

export const useBrandLogo = (website: string) => {
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchTimeoutRef = useRef<number | null>(null);
  const previousWebsiteRef = useRef<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  // Clear logo when website changes completely
  useEffect(() => {
    if (previousWebsiteRef.current !== website) {
      setLogoImage(null);
      setError(null);
      setFetchAttempted(false);
      previousWebsiteRef.current = website;
    }
  }, [website]);

  // Check cache and fetch logo if needed
  useEffect(() => {
    if (!website) {
      setLogoImage(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const domain = extractDomain(website);
    if (!domain) return;
    
    // Clear any pending timeout
    if (fetchTimeoutRef.current !== null) {
      window.clearTimeout(fetchTimeoutRef.current);
    }

    // First check in-memory cache
    const cached = logoCache.get(domain);
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY_TIME) {
      console.log("Using logo from memory cache for", domain);
      setLogoImage(cached.logo);
      setFetchAttempted(true);
      return;
    }
    
    // Try to load from localStorage
    try {
      const localStorageKey = `${LOGO_CACHE_KEY}_${domain}`;
      const timestampKey = `${LOGO_CACHE_TIMESTAMP_KEY}_${domain}`;
      
      const cachedLogo = localStorage.getItem(localStorageKey);
      const cachedTimestamp = localStorage.getItem(timestampKey);
      
      if (cachedLogo && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp, 10);
        const now = Date.now();
        
        if (now - timestamp < CACHE_EXPIRY_TIME) {
          console.log("Using logo from localStorage for", domain);
          setLogoImage(cachedLogo);
          // Update in-memory cache
          logoCache.set(domain, { logo: cachedLogo, timestamp });
          setFetchAttempted(true);
          return;
        }
      }
    } catch (err) {
      // Silently fail if localStorage is not available
      console.error("Error accessing localStorage:", err);
    }
    
    // Need to fetch the logo
    fetchTimeoutRef.current = window.setTimeout(() => {
      fetchLogo(domain);
    }, 100);
    
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

  // Fetch the logo from the API
  const fetchLogo = useCallback(async (domain: string) => {
    if (!domain) {
      setError("No domain provided");
      setFetchAttempted(true);
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
      console.log("Fetching logo for domain:", domain);
      // Fetch from edge function
      const response = await supabase.functions.invoke('fetch-brand-logo', {
        body: { website: domain }
      });
      
      if (controller.signal.aborted) return;
      
      if (response.error) {
        console.error("API error:", response.error);
        setError("Failed to fetch company logo");
        setIsLoading(false);
        setFetchAttempted(true);
      } else if (response.data?.logoImage) {
        const logo = response.data.logoImage;
        console.log("Logo fetched successfully for", domain);
        
        // Update state
        setLogoImage(logo);
        setIsLoading(false);
        setFetchAttempted(true);
        
        // Cache the logo in localStorage
        try {
          // In-memory cache
          logoCache.set(domain, { logo, timestamp: Date.now() });
          
          // localStorage cache
          const localStorageKey = `${LOGO_CACHE_KEY}_${domain}`;
          const timestampKey = `${LOGO_CACHE_TIMESTAMP_KEY}_${domain}`;
          localStorage.setItem(localStorageKey, logo);
          localStorage.setItem(timestampKey, Date.now().toString());
        } catch (err) {
          console.error("Error caching logo:", err);
        }
      } else {
        console.error("No logo found in API response");
        setError("No logo found");
        setIsLoading(false);
        setFetchAttempted(true);
      }
    } catch (err: any) {
      if (controller.signal.aborted) return;
      console.error("Error fetching logo:", err);
      setError(err.message || "Failed to fetch logo");
      setIsLoading(false);
      setFetchAttempted(true);
    }
  }, []);

  // Manual refresh function
  const refreshLogo = useCallback((websiteUrl?: string) => {
    const targetWebsite = websiteUrl || website;
    if (!targetWebsite) return;
    
    const domain = extractDomain(targetWebsite);
    if (domain) {
      console.log("Manually refreshing logo for", domain);
      // Clear the cache for this domain when manually refreshing
      try {
        logoCache.delete(domain);
        const localStorageKey = `${LOGO_CACHE_KEY}_${domain}`;
        const timestampKey = `${LOGO_CACHE_TIMESTAMP_KEY}_${domain}`;
        
        localStorage.removeItem(localStorageKey);
        localStorage.removeItem(timestampKey);
      } catch (err) {
        // Silently fail if localStorage is not available
        console.error("Error clearing localStorage:", err);
      }
      
      // Reset state before fetching
      setLogoImage(null);
      setFetchAttempted(false);
      fetchLogo(domain);
    }
  }, [website, fetchLogo]);

  return {
    logoImage,
    isLoading,
    error,
    refreshLogo,
    fetchAttempted
  };
};
