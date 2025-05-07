
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
import { useBrandLogo } from "@/hooks/useBrandLogo";

export const ProfileForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Use the custom hook for logo handling
  const {
    currentWebsite,
    setCurrentWebsite,
    logoImage,
    setLogoImage,
    isWebsiteChanged
  } = useProfileLogo();
  
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

  // Watch for website changes to update logo
  const websiteValue = form.watch("website");
  
  // Fetch logo when website changes
  const { logoImage: fetchedLogoImage, isLoading: isLogoLoading } = useBrandLogo(
    isWebsiteChanged(websiteValue) ? websiteValue : ''
  );
  
  // Update logo image when fetched
  useEffect(() => {
    if (fetchedLogoImage && isWebsiteChanged(websiteValue)) {
      setLogoImage(fetchedLogoImage);
      setCurrentWebsite(websiteValue);
    }
  }, [fetchedLogoImage, websiteValue, setLogoImage, setCurrentWebsite, isWebsiteChanged]);

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
          setLogoImage(data.logo_image || null);
          
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
  }, [user, form, toast, setCurrentWebsite, setLogoImage]);

  const onSubmit = async (data: UserProfileFormValues) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    // Normalize URL by adding https:// if not present
    const normalizedWebsite = !/^https?:\/\//i.test(data.website) 
      ? `https://${data.website}` 
      : data.website;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          company_name: data.companyName,
          website: normalizedWebsite,
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
          logo_image: logoImage,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      // Update the current website
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

  const companyNameValue = form.watch("companyName");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProfileFormSubmit 
          isLoading={isLoading}
          websiteValue={websiteValue}
          companyNameValue={companyNameValue}
          logoImage={logoImage}
        >
          <ProfileFormFields form={form} />
        </ProfileFormSubmit>
      </form>
    </Form>
  );
};
