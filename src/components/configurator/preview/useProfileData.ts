
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProfileData {
  company_name: string | null;
  website: string | null;
  logo_image: string | null;
}

export const useProfileData = (userId: string | undefined) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Extract domain from website
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
          .select('company_name, website, logo_image')
          .eq('id', userId)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching profile:", error);
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
    loading
  };
};
