
import React from "react";
import { LogoSection } from "./LogoSection";
import { SubmitButton } from "./SubmitButton";

interface ProfileFormSubmitProps {
  isLoading: boolean;
  websiteValue: string;
  companyNameValue: string;
  logoImage?: string | null;
  isLogoLoading?: boolean;
  onRefreshLogo?: () => void;
  children: React.ReactNode;
}

export const ProfileFormSubmit: React.FC<ProfileFormSubmitProps> = ({
  isLoading,
  websiteValue,
  companyNameValue,
  logoImage,
  isLogoLoading = false,
  onRefreshLogo,
  children
}) => {
  // Add logging to help debug logo issues
  console.log("ProfileFormSubmit logoImage:", logoImage ? "exists" : "null");
  console.log("ProfileFormSubmit isLogoLoading:", isLogoLoading);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <LogoSection 
          websiteValue={websiteValue}
          companyNameValue={companyNameValue}
          logoImage={logoImage}
          isLogoLoading={isLogoLoading}
        />
        
        <div className="flex-1 w-full">
          {children}
        </div>
      </div>
      
      <SubmitButton isLoading={isLoading} />
    </>
  );
};
