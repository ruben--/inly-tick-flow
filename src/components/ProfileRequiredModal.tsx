
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ProfileRequiredForm } from "./profile/ProfileRequiredForm";

export function ProfileRequiredModal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isProfileValid, setIsProfileValid] = useState(false);
  
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
  }, [user, toast]);

  // Function to handle successful profile update
  const handleProfileUpdated = () => {
    setIsProfileValid(true);
    setOpen(false);
  };
  
  // Function to handle attempted dialog close
  const handleOpenChange = (open: boolean) => {
    // Only allow closing if the profile is valid or if opening
    if (open || isProfileValid) {
      setOpen(open);
    } else {
      // Show a warning toast if trying to close with invalid profile
      toast({
        title: "Profile Incomplete",
        description: "Please fill in all required fields before continuing",
        variant: "destructive"
      });
    }
  };

  // Don't render anything if not needed or if no user
  if (!open || !user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={true}>
      <DialogContent 
        className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"
        showCloseButton={false} // Hide the X button completely
        onPointerDownOutside={(e) => {
          // Prevent closing on outside click
          e.preventDefault();
          toast({
            title: "Profile Incomplete",
            description: "Please complete your profile information before continuing",
            variant: "destructive"
          });
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing with escape key
          e.preventDefault();
          toast({
            title: "Profile Incomplete",
            description: "Please complete your profile information before continuing",
            variant: "destructive"
          });
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please complete your profile information before continuing
          </DialogDescription>
        </DialogHeader>
        
        <ProfileRequiredForm userId={user.id} onSuccess={handleProfileUpdated} />
      </DialogContent>
    </Dialog>
  );
}
