
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfileFormValues } from "@/components/profile/types";

interface UseProfileSubmitProps {
  userId: string;
  initialWebsite: string | null;
  setCurrentWebsite: (website: string | null) => void;
  logoImage: string | null;
  refreshLogo: () => void;
  onSuccess?: () => void;
}

export const useProfileSubmit = ({
  userId,
  initialWebsite,
  setCurrentWebsite,
  logoImage,
  refreshLogo,
  onSuccess
}: UseProfileSubmitProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async (data: UserProfileFormValues) => {
    if (!userId) return;
    
    setIsLoading(true);
    
    try {
      // Check if website has changed
      const websiteChanged = initialWebsite !== data.website;
      
      // Update the current website before saving
      if (data.website) {
        setCurrentWebsite(data.website);
      }
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          company_name: data.companyName,
          website: data.website,
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
          logo_image: logoImage,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      // If website changed, fetch a new logo
      if (websiteChanged && data.website) {
        console.log("Website changed, fetching new logo");
        refreshLogo();
      }
      
      toast({
        title: "Success!",
        description: "Your profile has been updated",
      });
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update your profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, initialWebsite, setCurrentWebsite, logoImage, refreshLogo, toast, onSuccess]);

  return {
    isLoading,
    handleSubmit
  };
};
