
import React from "react";
import { CompanyLogo } from "./CompanyLogo";
import { RefreshLogoButton } from "./RefreshLogoButton";

interface LogoSectionProps {
  websiteValue: string;
  companyNameValue: string;
  logoImage?: string | null;
  isLogoLoading?: boolean;
  onRefreshLogo?: () => void;
}

export const LogoSection: React.FC<LogoSectionProps> = ({
  websiteValue,
  companyNameValue,
  logoImage,
  isLogoLoading = false,
  onRefreshLogo
}) => {
  return (
    <div className="relative flex flex-col items-center space-y-2">
      <CompanyLogo 
        website={websiteValue}
        companyName={companyNameValue}
        logoImage={logoImage}
        className="h-20 w-20"
        isLoading={isLogoLoading}
      />
      
      {websiteValue && onRefreshLogo && (
        <RefreshLogoButton 
          onRefresh={onRefreshLogo}
          isDisabled={isLogoLoading}
        />
      )}
    </div>
  );
};
