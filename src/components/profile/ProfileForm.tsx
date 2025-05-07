
import React, { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const ProfileForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  
  // Define profile schema
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
    mode: "onChange"
  });

  // Use the custom hook for logo handling with empty initial values
  const {
    currentWebsite,
    setCurrentWebsite,
    logoImage,
    setLogoImage,
    isLogoLoading,
    error: logoError,
    refreshLogo
  } = useProfileLogo();
  
  // Watch for website changes in the form
  const websiteValue = form.watch("website");
  const companyNameValue = form.watch("companyName");
  
  // Set website value once on initial load, but not during typing
  useEffect(() => {
    if (websiteValue && !currentWebsite) {
      setCurrentWebsite(websiteValue);
    }
  }, [websiteValue, currentWebsite, setCurrentWebsite]);

  // Fetch existing profile data if available
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      setProfileLoading(true);
      
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
        setProfileLoading(false);
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
      // Set the current website before saving
      setCurrentWebsite(normalizedWebsite);
      
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
          isLoading={isLoading || isLogoLoading}
          websiteValue={websiteValue}
          companyNameValue={companyNameValue}
          logoImage={logoImage}
          isLogoLoading={isLogoLoading}
          onRefreshLogo={refreshLogo}
        >
          <ProfileFormFields form={form} />
        </ProfileFormSubmit>
      </form>
    </Form>
  );
};
