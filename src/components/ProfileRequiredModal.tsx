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
    setOpen(false);
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
        
        <ProfileRequiredForm userId={user.id} onSuccess={handleProfileUpdated} />
      </DialogContent>
    </Dialog>
  );
}
