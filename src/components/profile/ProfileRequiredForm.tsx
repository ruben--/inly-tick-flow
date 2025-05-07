
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
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [savedWebsite, setSavedWebsite] = useState<string | null>(null);
  
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
          setLogoUrl(data.logo_url || null);
          setLogoImage(data.logo_image || null);
          setSavedWebsite(data.website || null);
          
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
      }
    };
    
    fetchProfile();
  }, [userId, form, toast]);

  const handleLogoFound = (foundLogoUrl: string | null, foundLogoImage: string | null) => {
    if (foundLogoUrl) {
      setLogoUrl(foundLogoUrl);
    }
    if (foundLogoImage) {
      setLogoImage(foundLogoImage);
    }
  };

  const onSubmit = async (data: UserProfileFormValues) => {
    if (!userId) return;
    
    setIsLoading(true);
    
    // Normalize URL by adding https:// if not present
    const normalizedWebsite = !/^https?:\/\//i.test(data.website) 
      ? `https://${data.website}` 
      : data.website;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
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

  // Get current website value for logo display
  const websiteValue = form.watch("website");
  const companyNameValue = form.watch("companyName");
  
  // Check if website has changed from saved version to determine if we need a new logo
  const websiteChanged = savedWebsite !== null && websiteValue !== savedWebsite;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center mb-4">
          <CompanyLogo 
            website={websiteValue} 
            companyName={companyNameValue}
            className="h-16 w-16"
            onLogoFound={handleLogoFound}
            logoUrl={!websiteChanged ? logoUrl : null}
            logoImage={!websiteChanged ? logoImage : null}
          />
        </div>

        <ProfileFormFields form={form} />
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
};
