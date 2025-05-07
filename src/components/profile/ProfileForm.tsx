
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormFields } from "./ProfileFormFields";
import { UserProfileFormValues } from "./ProfileRequiredForm";
import { useProfileLogo } from "@/hooks/useProfileLogo";
import { ProfileFormSubmit } from "./ProfileFormSubmit";

interface ProfileFormProps {
  initialLogoImage?: string | null;
  initialLogoUrl?: string | null;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ 
  initialLogoImage,
  initialLogoUrl
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Use the custom hook for logo handling
  const {
    logoUrl,
    logoImage,
    currentWebsite,
    fetchAttempted,
    setCurrentWebsite,
    handleLogoFound,
    handleLogoUpload,
    isWebsiteChanged
  } = useProfileLogo({
    initialLogoImage,
    initialLogoUrl
  });
  
  // Use the same profile schema as in ProfileRequiredForm
  const profileSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    website: z.string()
      .min(1, "Website is required")
      .refine(val => {
        try {
          const url = new URL(!/^https?:\/\//i.test(val) ? `https://${val}` : val);
          return true;
        } catch {
          return false;
        }
      }, "Must be a valid URL"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    role: z.string().min(1, "Role is required")
  });
  
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
      if (!user?.id) return;
      
      setIsLoading(true);
      
      try {
        console.log("Fetching profile data in form");
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          console.log("Profile data fetched:", data);
          setCurrentWebsite(data.website || null);
          
          form.reset({
            companyName: data.company_name || "",
            website: data.website || "",
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            role: data.role || ""
          });
        } else {
          console.log("No profile data found");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, form, toast, setCurrentWebsite]);

  const onSubmit = async (data: UserProfileFormValues) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    // Normalize URL by adding https:// if not present
    const normalizedWebsite = !/^https?:\/\//i.test(data.website) 
      ? `https://${data.website}` 
      : data.website;
    
    try {
      console.log("Saving profile with logo:", { 
        hasLogoUrl: !!logoUrl, 
        hasLogoImage: !!logoImage 
      });
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          company_name: data.companyName,
          website: normalizedWebsite,
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
          logo_url: logoUrl,
          logo_image: logoImage,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      // Update the current website to prevent unnecessary API calls
      setCurrentWebsite(normalizedWebsite);
      
      toast({
        title: "Success!",
        description: "Your profile has been updated",
      });
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

  // Get current website value for logo display
  const websiteValue = form.watch("website");
  const companyNameValue = form.watch("companyName");
  
  // Check if website has changed from current version
  const websiteChanged = isWebsiteChanged(websiteValue);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProfileFormSubmit 
          isLoading={isLoading}
          websiteValue={websiteValue}
          companyNameValue={companyNameValue}
          logoUrl={logoUrl}
          logoImage={logoImage}
          fetchAttempted={fetchAttempted}
          websiteChanged={websiteChanged}
          onLogoFound={handleLogoFound}
          onLogoUpload={handleLogoUpload}
        >
          <ProfileFormFields form={form} />
        </ProfileFormSubmit>
      </form>
    </Form>
  );
};
