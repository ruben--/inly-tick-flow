
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileData } from "@/components/profile/types";
import { useLogo } from "@/contexts/LogoContext";

export interface UseProfileDataProps {
  userId: string;
}

export const useProfileData = ({ userId }: UseProfileDataProps) => {
  const { toast } = useToast();
  const [profileLoading, setProfileLoading] = useState(true);
  const [data, setData] = useState<ProfileData | null>(null);
  const [isError, setIsError] = useState(false);
  const [initialWebsite, setInitialWebsite] = useState<string | null>(null);
  
  // Use the logo context
  const { 
    logoImage, 
    isLoading: isLogoLoading, 
    error: logoError,
    refreshLogo,
    setLogoImage
  } = useLogo();

  // Fetch existing profile data if available
  useEffect(() => {
    fetchProfile();
  }, [userId]);
  
  const fetchProfile = async () => {
    if (!userId) return;
    
    try {
      setProfileLoading(true);
      setIsError(false);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        // Set logo data if available
        if (data.logo_image) {
          setLogoImage(data.logo_image);
        }
        
        // Update website and set initial website
        const website = data.website || "";
        setInitialWebsite(website);
        
        // Set profile data
        setData({
          companyName: data.company_name || "",
          website: website,
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          role: data.role || ""
        });
        
        // Check if required profile data is missing
        if (!data.company_name || !data.first_name || !data.last_name || !data.role || !data.website) {
          setIsError(true);
          toast({
            title: "Profile Incomplete",
            description: "Please complete your profile data.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setIsError(true);
      toast({
        title: "Error",
        description: "Could not load your profile data",
        variant: "destructive"
      });
    } finally {
      setProfileLoading(false);
    }
  };

  return {
    data,
    isLoading: profileLoading,
    isError,
    refetch: fetchProfile,
    initialWebsite,
    logoImage,
    isLogoLoading,
    logoError,
    refreshLogo
  };
};
