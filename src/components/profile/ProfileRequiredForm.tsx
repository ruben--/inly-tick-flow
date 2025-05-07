
import React from "react";
import { Form } from "@/components/ui/form";
import { ProfileFormSubmit } from "./ProfileFormSubmit";
import { ProfileFormFields } from "./ProfileFormFields";
import { ProfileLoadingState } from "./ProfileLoadingState";
import { LogoErrorAlert } from "./LogoErrorAlert";
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileSubmit } from "@/hooks/useProfileSubmit";
import { ProfileFormProps } from "./types";

export const ProfileRequiredForm: React.FC<ProfileFormProps> = ({ userId, onSuccess }) => {
  const {
    form,
    profileLoading,
    initialWebsite,
    setCurrentWebsite,
    logoImage,
    isLogoLoading,
    logoError,
    refreshLogo,
    websiteValue,
    companyNameValue
  } = useProfileData({ userId });
  
  const { isLoading, handleSubmit } = useProfileSubmit({
    userId,
    initialWebsite,
    setCurrentWebsite,
    logoImage,
    refreshLogo,
    onSuccess
  });

  // Handle website blur to update currentWebsite
  const handleWebsiteBlur = React.useCallback(() => {
    if (websiteValue) {
      setCurrentWebsite(websiteValue);
    }
  }, [websiteValue, setCurrentWebsite]);

  if (profileLoading) {
    return <ProfileLoadingState />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {logoError && <LogoErrorAlert error={logoError} />}
        
        <ProfileFormSubmit 
          isLoading={isLoading}
          websiteValue={websiteValue}
          companyNameValue={companyNameValue}
          logoImage={logoImage}
          isLogoLoading={isLogoLoading}
          onRefreshLogo={refreshLogo}
        >
          <ProfileFormFields 
            form={form}
            onWebsiteBlur={handleWebsiteBlur}
          />
        </ProfileFormSubmit>
      </form>
    </Form>
  );
};
