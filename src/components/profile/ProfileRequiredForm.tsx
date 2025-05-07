
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormFields } from "./ProfileFormFields";
import { useProfileLogo } from "@/hooks/useProfileLogo";
import { ProfileFormSubmit } from "./ProfileFormSubmit";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { isValidUrl } from "@/utils/brandfetch";

// Create validation schema
const profileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  website: z.string()
    .min(1, "Website is required")
    .refine(val => isValidUrl(val), 
      "Must be a valid URL (e.g. example.com or https://example.com)"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.string().min(1, "Role is required")
});

export type UserProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileRequiredFormProps {
  userId: string;
  onSuccess: () => void;
}

export const ProfileRequiredForm: React.FC<ProfileRequiredFormProps> = ({ userId, onSuccess }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [initialWebsite, setInitialWebsite] = useState<string | null>(null);
  
  const {
    currentWebsite,
    setCurrentWebsite,
    logoImage,
    setLogoImage,
    isLogoLoading,
    error: logoError,
    refreshLogo
  } = useProfileLogo();
  
  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      companyName: "",
      website: "",
      firstName: "",
      lastName: "",
      role: ""
    },
    mode: "onChange" // Validate on change for better user experience
  });

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
        
        // Set form default values if profile exists but is incomplete
        if (data) {
          setCurrentWebsite(data.website || null);
          setLogoImage(data.logo_image || null);
          // Store initial website value for comparison later
          setInitialWebsite(data.website || null);
          
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
  
  // Handle website blur to update currentWebsite
  const handleWebsiteBlur = useCallback(() => {
    if (websiteValue) {
      setCurrentWebsite(websiteValue);
    }
  }, [websiteValue, setCurrentWebsite]);

  const onSubmit = async (data: UserProfileFormValues) => {
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
      
      // Call the onSuccess callback
      onSuccess();
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
  };

  if (profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="animate-pulse h-20 w-20 bg-gray-200 rounded-full"></div>
        <div className="animate-pulse h-4 w-48 bg-gray-200 rounded"></div>
        <div className="animate-pulse h-4 w-36 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {logoError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription className="text-sm">{logoError}</AlertDescription>
          </Alert>
        )}
        
        <ProfileFormSubmit 
          isLoading={isLoading}
          websiteValue={websiteValue}
          companyNameValue={companyNameValue}
          logoImage={logoImage}
          isLogoLoading={isLogoLoading}
          onRefreshLogo={refreshLogo}
        >
          <ProfileFormFields 
            form={form}
            onWebsiteBlur={handleWebsiteBlur}
          />
        </ProfileFormSubmit>
      </form>
    </Form>
  );
};
