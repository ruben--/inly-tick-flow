
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useProgressBar = (onProfileStatusChange?: (isComplete: boolean) => void) => {
  const { user } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);
  const [isPermanentlyHidden, setIsPermanentlyHidden] = useState<boolean>(false);

  // Check if progress bar should be hidden based on localStorage
  useEffect(() => {
    const hiddenState = localStorage.getItem('progressBarHidden');
    if (hiddenState === 'true') {
      setIsPermanentlyHidden(true);
    }
  }, []);

  // Check if profile is complete
  useEffect(() => {
    const checkProfileStatus = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('company_name, first_name, last_name, role, website')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error("Error checking profile:", error);
          return;
        }
        
        // Check if all required profile fields are filled
        const profileComplete = data && 
          data.company_name && 
          data.first_name && 
          data.last_name && 
          data.role && 
          data.website;
        
        setIsProfileComplete(!!profileComplete);
        
        // Call the callback with the profile status
        if (onProfileStatusChange) {
          onProfileStatusChange(!!profileComplete);
        }
      } catch (error) {
        console.error("Error checking profile status:", error);
      }
    };
    
    checkProfileStatus();
  }, [user, onProfileStatusChange]);

  // Function to permanently hide the progress bar
  const handlePermanentHide = () => {
    localStorage.setItem('progressBarHidden', 'true');
    setIsPermanentlyHidden(true);
  };

  return {
    isProfileComplete,
    isPermanentlyHidden,
    handlePermanentHide
  };
};
