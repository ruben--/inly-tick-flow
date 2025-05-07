
import React from "react";
import { CompanyLogo } from "./CompanyLogo";

interface LogoSectionProps {
  websiteValue: string;
  companyNameValue: string;
  logoImage?: string | null;
  isLogoLoading?: boolean;
}

export const LogoSection: React.FC<LogoSectionProps> = ({
  websiteValue,
  companyNameValue,
  logoImage,
  isLogoLoading = false
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
      <span className="text-sm text-muted-foreground">{companyNameValue || 'Company'}</span>
    </div>
  );
};
