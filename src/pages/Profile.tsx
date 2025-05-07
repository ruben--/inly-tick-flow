
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function Profile() {
  const { user } = useAuth();
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch the user's profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Fetching profile data for user:", user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('logo_image, logo_url')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching profile logo:", error);
          setIsLoading(false);
          return;
        }
        
        // Set the logo image and URL if available
        console.log("Profile data fetched:", data);
        if (data) {
          setLogoImage(data.logo_image);
          setLogoUrl(data.logo_url);
        }
      } catch (err) {
        console.error("Error in profile fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
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
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-pulse h-16 w-16 bg-gray-200 rounded-full"></div>
            </div>
          ) : (
            <ProfileForm 
              initialLogoImage={logoImage} 
              initialLogoUrl={logoUrl}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
