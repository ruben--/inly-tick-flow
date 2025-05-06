
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormFields } from "./ProfileFormFields";
import { UserProfileFormValues } from "./ProfileRequiredForm"; // Import the type

interface ProfileFormProps {
  onProfileComplete?: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onProfileComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Use the same profile schema as in ProfileRequiredForm
  const profileSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    website: z.string()
      .min(1, "Website is required")
      // First validate it's a string with minimum length
      // Then validate it's a URL after transformation
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
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          form.reset({
            companyName: data.company_name || "",
            website: data.website || "",
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            role: data.role || ""
          });
          
          // Check if profile is complete
          if (data.company_name && data.website && data.first_name && data.last_name && data.role) {
            onProfileComplete?.();
          }
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
  }, [user, form, toast, onProfileComplete]);

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
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Your profile has been updated",
      });
      
      // Call onProfileComplete callback if provided
      onProfileComplete?.();
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProfileFormFields form={form} />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
};
