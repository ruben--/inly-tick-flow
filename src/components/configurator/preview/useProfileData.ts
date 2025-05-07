
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProfileData {
  logo_url: string | null;
  logo_image: string | null;
  company_name: string | null;
  website: string | null;
}

export const useProfileData = (userId: string | undefined) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Extract domain from profile website or use default
  const companyDomain = profileData?.website 
    ? new URL(!/^https?:\/\//i.test(profileData.website) ? `https://${profileData.website}` : profileData.website).hostname 
    : 'yourcompany.com';

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
          .select('logo_url, logo_image, company_name, website')
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

  return { profileData, companyDomain, loading };
};
