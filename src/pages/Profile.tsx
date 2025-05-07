
import { useAuth } from "@/contexts/AuthContext";
import { PageTransition } from "@/components/transitions/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm, ProfileFormValues } from "@/components/profile/ProfileForm";
import { LogoSection } from "@/components/profile/LogoSection";
import { useProfileSubmit } from "@/hooks/useProfileSubmit";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { useProfileData } from "@/hooks/useProfileData";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { user } = useAuth();
  const userId = user?.id;
  const [error, setError] = useState<string | null>(null);
  
  const { 
    data: profileData, 
    isLoading: profileLoading, 
    isError: profileError, 
    refetch: refetchProfile,
    initialWebsite,
    logoImage,
    isLogoLoading,
    refreshLogo
  } = useProfileData({ userId });

  const { handleSubmit, isLoading } = useProfileSubmit({
    userId,
    initialWebsite,
    onSuccess: () => {
      setError(null);
      refetchProfile();
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const handleFormSubmit = async (data: ProfileFormValues) => {
    if (!userId) return;
    setError(null);
    await handleSubmit({
      ...data,
      firstName: profileData?.firstName || "",
      lastName: profileData?.lastName || "",
      role: profileData?.role || ""
    });
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and company profile
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              {profileLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-1/3 mt-2" />
                </div>
              ) : (
                <ProfileForm 
                  onSubmit={handleFormSubmit}
                  isLoading={isLoading}
                  initialData={profileData}
                />
              )}
            </CardContent>
          </Card>

          {/* Company Logo */}
          <LogoSection 
            userId={userId}
            websiteValue={profileData?.website}
            companyNameValue={profileData?.companyName}
            logoImage={logoImage}
            isLogoLoading={isLogoLoading}
            onRefreshLogo={() => profileData?.website && refreshLogo(profileData.website)}
          />
        </div>
      </div>
    </PageTransition>
  );
}
