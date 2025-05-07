
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function Profile() {
  const { user } = useAuth();
  const [logoImage, setLogoImage] = useState<string | null>(null);
  
  // Fetch the user's logo on component mount
  useEffect(() => {
    const fetchProfileLogo = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('logo_image, logo_url')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching profile logo:", error);
          return;
        }
        
        // Set the logo image if available
        if (data && data.logo_image) {
          setLogoImage(data.logo_image);
        }
      } catch (err) {
        console.error("Error in profile fetch:", err);
      }
    };
    
    fetchProfileLogo();
  }, [user]);

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-medium">Your Profile</CardTitle>
          <CardDescription>
            Update your personal and company information
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ProfileForm initialLogoImage={logoImage} />
        </CardContent>
      </Card>
    </div>
  );
}
