
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfileFormValues } from "@/components/profile/types";
import { useLogo } from "@/contexts/LogoContext";

export interface UseProfileSubmitProps {
  userId: string;
  initialWebsite?: string | null;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useProfileSubmit = ({
  userId,
  initialWebsite,
  onSuccess,
  onError
}: UseProfileSubmitProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { logoImage, refreshLogo } = useLogo();

  const handleSubmit = useCallback(async (data: UserProfileFormValues) => {
    if (!userId) return;
    
    setIsLoading(true);
    
    try {
      // Check if website has changed
      const websiteChanged = initialWebsite !== data.website;
      
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
        refreshLogo(data.website);
      }
      
      toast({
        title: "Success!",
        description: "Your profile has been updated",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      
      if (onError && error instanceof Error) {
        onError(error);
      } else {
        toast({
          title: "Error",
          description: "Failed to update your profile",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, initialWebsite, logoImage, refreshLogo, toast, onSuccess, onError]);

  return {
    isLoading,
    handleSubmit
  };
};
