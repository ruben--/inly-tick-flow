
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProfileFormValues {
  companyName: string;
  website: string;
  firstName: string;
  lastName: string;
  role: string;
}

export function ProfileRequiredModal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const form = useForm<ProfileFormValues>({
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

  const onSubmit = async (data: ProfileFormValues) => {
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
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Energy Manager" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
