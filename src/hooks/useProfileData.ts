
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserProfileFormValues, profileSchema } from "@/components/profile/types";
import { useProfileLogo } from "./useProfileLogo";

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

  // Use the custom hook for logo handling with empty initial values
  // We'll populate these from the database fetch
  const {
    currentWebsite,
    setCurrentWebsite,
    logoImage,
    setLogoImage,
    isLogoLoading,
    error: logoError,
    refreshLogo
  } = useProfileLogo();
  
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
          // Set logo data first to prevent unnecessary API calls
          setLogoImage(data.logo_image || null);
          
          // Then update the website after a short delay
          // to ensure the logo is set first
          setTimeout(() => {
            setCurrentWebsite(data.website || null);
            setInitialWebsite(data.website || null);
          }, 100);
          
          // Update form values
          form.reset({
            companyName: data.company_name || "",
            website: data.website || "",
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
  }, [userId, form, toast, setCurrentWebsite, setLogoImage]);

  // Watch for website changes in the form
  const websiteValue = form.watch("website");
  const companyNameValue = form.watch("companyName");

  return {
    form,
    profileLoading,
    initialWebsite,
    currentWebsite,
    setCurrentWebsite,
    logoImage,
    isLogoLoading,
    logoError,
    refreshLogo,
    websiteValue,
    companyNameValue
  };
};
