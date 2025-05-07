
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

  // Extract domain from profile website or use default
  const companyDomain = profileData?.website 
    ? new URL(!/^https?:\/\//i.test(profileData.website) ? `https://${profileData.website}` : profileData.website).hostname 
    : 'yourcompany.com';
    
  // Use the brandLogo hook to ensure consistent logo fetching
  const { logoImage, refreshLogo } = useBrandLogo(profileData?.website || '');

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
          console.error("Error fetching profile data:", error);
          return;
        }
        
        setProfileData(data);
      } catch (err) {
        console.error("Error in profile fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [userId]);

  return { 
    profileData, 
    companyDomain, 
    loading,
    // Return the logo from the brand logo hook
    logoImage: logoImage || profileData?.logo_image,
    refreshLogo: () => profileData?.website ? refreshLogo(profileData.website) : null
  };
};
