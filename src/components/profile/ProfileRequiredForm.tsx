
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormFields } from "./ProfileFormFields";
import { CompanyLogo } from "./CompanyLogo";
import { useProfileLogo } from "@/hooks/useProfileLogo";
import { RefreshCcw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Create validation schema
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

export type UserProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileRequiredFormProps {
  userId: string;
  onSuccess: () => void;
}

export const ProfileRequiredForm: React.FC<ProfileRequiredFormProps> = ({ userId, onSuccess }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  
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

  // Watch for website changes - but don't set currentWebsite immediately 
  // to avoid unnecessary logo fetches
  const websiteValue = form.watch("website");
  const companyNameValue = form.watch("companyName");
  
  // Update the website in the logo hook but only on form submission
  // This avoids constant logo fetching while the user is typing
  useEffect(() => {
    if (websiteValue && !currentWebsite) {
      // If we have a website value but no currentWebsite, set it once
      setCurrentWebsite(websiteValue);
    }
  }, [websiteValue, currentWebsite, setCurrentWebsite]);

  const onSubmit = async (data: UserProfileFormValues) => {
    if (!userId) return;
    
    setIsLoading(true);
    
    // Normalize URL by adding https:// if not present
    const normalizedWebsite = !/^https?:\/\//i.test(data.website) 
      ? `https://${data.website}` 
      : data.website;
    
    try {
      // Update the current website
      setCurrentWebsite(normalizedWebsite);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
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
  
  const isSubmitDisabled = isLoading || isLogoLoading;

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
        <div className="flex flex-col items-center mb-4 relative">
          <CompanyLogo 
            website={websiteValue} 
            companyName={companyNameValue}
            logoImage={logoImage}
            className="h-16 w-16"
          />
          
          {logoError && (
            <Alert variant="destructive" className="mt-3 py-2">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription className="text-sm">{logoError}</AlertDescription>
            </Alert>
          )}
          
          {websiteValue && (
            <Button 
              type="button"
              size="sm"
              variant="ghost"
              className="mt-2 text-xs h-6"
              onClick={(e) => {
                e.preventDefault();
                refreshLogo();
              }}
              disabled={isSubmitDisabled}
            >
              <RefreshCcw className={`h-3 w-3 mr-1 ${isLogoLoading ? 'animate-spin' : ''}`} />
              {isLogoLoading ? 'Loading...' : 'Refresh logo'}
            </Button>
          )}
        </div>

        <ProfileFormFields form={form} />
        
        <Button type="submit" disabled={isSubmitDisabled} className="w-full">
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
};
