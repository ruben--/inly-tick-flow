
import React from "react";
import { LogoSection } from "./LogoSection";
import { SubmitButton } from "./SubmitButton";
import { useLogo } from "@/contexts/LogoContext";

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
  const { refreshLogo } = useLogo();
  
  const handleRefresh = () => {
    if (onRefreshLogo) {
      onRefreshLogo();
    } else {
      refreshLogo(websiteValue);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <LogoSection 
          websiteValue={websiteValue}
          companyNameValue={companyNameValue}
          logoImage={logoImage}
          isLogoLoading={isLogoLoading}
          onRefreshLogo={handleRefresh}
        />
        
        <div className="flex-1 w-full">
          {children}
        </div>
      </div>
      
      <SubmitButton isLoading={isLoading} />
    </>
  );
};
