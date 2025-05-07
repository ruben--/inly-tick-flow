
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserProfileFormValues, profileSchema } from "@/components/profile/types";
import { useLogo } from "@/contexts/LogoContext";

interface UseProfileDataProps {
  userId: string;
}

export const useProfileData = ({ userId }: UseProfileDataProps) => {
  const { toast } = useToast();
  const [profileLoading, setProfileLoading] = useState(true);
  const [initialWebsite, setInitialWebsite] = useState<string | null>(null);
  
  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      companyName: "",
      website: "",
      firstName: "",
      lastName: "",
      role: ""
    },
    mode: "onChange"
  });

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
    const fetchProfile = async () => {
      if (!userId) return;
      
      try {
        setProfileLoading(true);
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
          
          // Update form values
          form.reset({
            companyName: data.company_name || "",
            website: website,
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            role: data.role || ""
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Could not load your profile data",
          variant: "destructive"
        });
      } finally {
        setProfileLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId, form, toast, setLogoImage]);

  // Watch for website changes in the form
  const websiteValue = form.watch("website");
  const companyNameValue = form.watch("companyName");

  return {
    form,
    profileLoading,
    initialWebsite,
    logoImage,
    isLogoLoading,
    logoError,
    refreshLogo,
    websiteValue,
    companyNameValue
  };
};
