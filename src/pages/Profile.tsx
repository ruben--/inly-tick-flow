
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
          .select('logo_image, logo_url, company_name')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching profile data:", error);
          setError("Could not load your profile data. Please try again later.");
          setIsLoading(false);
          return;
        }
        
        // Set the logo image and URL if available
        console.log("Profile data fetched:", data);
        if (data) {
          if (data.logo_image) {
            console.log("Found logo image in profile data");
            setLogoImage(data.logo_image);
          } else {
            console.log("No logo image found in profile data");
          }
          
          if (data.logo_url) {
            setLogoUrl(data.logo_url);
          }
        } else {
          console.log("No profile data found");
        }
      } catch (err) {
        console.error("Error in profile fetch:", err);
        setError("An unexpected error occurred while loading your profile.");
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
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="animate-pulse h-20 w-20 bg-gray-200 rounded-full"></div>
              <div className="animate-pulse h-4 w-48 bg-gray-200 rounded"></div>
              <div className="animate-pulse h-4 w-36 bg-gray-200 rounded"></div>
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
