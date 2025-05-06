
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormFields } from "./profile/ProfileFormFields";
import { UserProfileFormValues } from "./profile/ProfileForm";

export function ProfileRequiredModal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const form = useForm<UserProfileFormValues>({
    defaultValues: {
      companyName: "",
      website: "",
      firstName: "",
      lastName: "",
      role: ""
    }
  });

  // Check if profile is complete
  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          throw error;
        }
        
        // If profile doesn't exist or required fields are empty, show modal
        if (!data || 
            !data.company_name || 
            !data.first_name || 
            !data.last_name || 
            !data.role ||
            !data.website) {
          setOpen(true);
          
          // Set form default values if profile exists but is incomplete
          if (data) {
            form.reset({
              companyName: data.company_name || "",
              website: data.website || "",
              firstName: data.first_name || "",
              lastName: data.last_name || "",
              role: data.role || ""
            });
          }
        }
      } catch (error) {
        console.error("Error checking profile:", error);
        toast({
          title: "Error",
          description: "Could not check profile status",
          variant: "destructive"
        });
      }
    };
    
    checkProfileCompletion();
  }, [user, form, toast]);

  const onSubmit = async (data: UserProfileFormValues) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          company_name: data.companyName,
          website: data.website,
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
      
      // Close modal after successful submission
      setOpen(false);
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

  // Don't render anything if not needed or if no user
  if (!open || !user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please complete your profile information before continuing
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ProfileFormFields form={form} />
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
