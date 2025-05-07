
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBrandLogo } from '@/hooks/useBrandLogo';
import { extractDomain } from '@/utils/brandfetch';

interface LogoContextType {
  logoImage: string | null;
  isLoading: boolean;
  error: string | null;
  refreshLogo: (website?: string) => void;
  setLogoImage: (logo: string | null) => void;
}

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export const LogoProvider: React.FC<{ children: React.ReactNode; userId?: string }> = ({ 
  children, 
  userId 
}) => {
  // State to store the actual logo image data
  const [logoImage, setLogoImage] = useState<string | null>(null);
  // Website state to use for fetching
  const [website, setWebsite] = useState<string | null>(null);
  // Tracking if we've already tried loading from DB
  const [dbLoaded, setDbLoaded] = useState(false);

  // Load logo from database only once on initial mount
  useEffect(() => {
    if (!userId || dbLoaded) return;

    const loadLogoFromDB = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('logo_image, website')
          .eq('id', userId)
          .maybeSingle();
          
        if (data?.logo_image) {
          console.log("LogoContext: Using logo from database");
          setLogoImage(data.logo_image);
        }
        
        if (data?.website) {
          setWebsite(data.website);
        }
        
        setDbLoaded(true);
      } catch (err) {
        console.error("Error loading logo from DB:", err);
        setDbLoaded(true);
      }
    };
    
    loadLogoFromDB();
  }, [userId, dbLoaded]);
  
  // Use BrandLogo hook only when needed
  const shouldFetch = !logoImage && website && dbLoaded;
  const { 
    logoImage: fetchedLogoImage, 
    isLoading, 
    error, 
    refreshLogo: refreshBrandLogo 
  } = useBrandLogo(shouldFetch ? website : '');
  
  // Update logo when fetched from API
  useEffect(() => {
    if (fetchedLogoImage && !logoImage) {
      console.log("LogoContext: Setting logo from API fetch");
      setLogoImage(fetchedLogoImage);
    }
  }, [fetchedLogoImage, logoImage]);
  
  // Enhanced refresh function
  const refreshLogo = (newWebsite?: string) => {
    if (newWebsite) {
      setWebsite(newWebsite);
    }
    
    setLogoImage(null);
    
    if (website || newWebsite) {
      refreshBrandLogo(); 
    }
  };
  
  return (
    <LogoContext.Provider value={{ 
      logoImage, 
      isLoading: isLoading && shouldFetch,
      error,
      refreshLogo,
      setLogoImage
    }}>
      {children}
    </LogoContext.Provider>
  );
};

export const useLogo = () => {
  const context = useContext(LogoContext);
  if (context === undefined) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
};
