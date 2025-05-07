
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBrandLogo } from '@/hooks/useBrandLogo';

interface ProfileData {
  company_name: string | null;
  website: string | null;
  logo_image: string | null;
}

export const useProfileData = (userId: string | undefined) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoImageState, setLogoImageState] = useState<string | null>(null);
  const [logoFetchAttempted, setLogoFetchAttempted] = useState(false);

  // Extract domain from website
  const companyDomain = profileData?.website 
    ? new URL(!/^https?:\/\//i.test(profileData.website) ? `https://${profileData.website}` : profileData.website).hostname 
    : 'yourcompany.com';
    
  // Use the brandLogo hook for logo with proper dependency handling
  // Only try to fetch if we don't already have a logo_image from the database
  const { logoImage: fetchedLogoImage, isLoading: logoFetchLoading, refreshLogo } = useBrandLogo(
    (!logoImageState && profileData?.website && !logoFetchAttempted) ? (profileData?.website || '') : ''
  );

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('company_name, website, logo_image')
          .eq('id', userId)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }
        
        console.log("Profile data fetched:", data);
        setProfileData(data);
        
        // If we have a logo from the database, use it directly
        if (data?.logo_image) {
          console.log("Using logo from database:", data.logo_image.substring(0, 50) + "...");
          setLogoImageState(data.logo_image);
        } else {
          // Mark that we need to fetch a logo if not found in DB
          setLogoFetchAttempted(false);
        }
      } catch (err) {
        console.error("Error in profile fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [userId]);
  
  // Update logo state when fetched logo changes
  useEffect(() => {
    if (fetchedLogoImage && !logoImageState) {
      console.log("Using fetched logo from BrandFetch");
      setLogoImageState(fetchedLogoImage);
      setLogoFetchAttempted(true);
    }
  }, [fetchedLogoImage, logoImageState]);

  // Get the final logo to use - prioritize stored logo over fetched logo
  const finalLogo = logoImageState || profileData?.logo_image || null;
  
  console.log("Final logo state:", finalLogo ? "Logo exists" : "No logo");
  console.log("Logo loading state:", logoFetchLoading && !logoImageState);

  return { 
    profileData, 
    companyDomain, 
    loading,
    logoLoading: logoFetchLoading && !logoImageState && !logoFetchAttempted,
    logoImage: finalLogo,
    refreshLogo
  };
};
