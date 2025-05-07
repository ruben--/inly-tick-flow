
import React from "react";
import { CompanyLogo } from "./CompanyLogo";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useLogo } from "@/contexts/LogoContext";

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
  const { isLoading: contextLoading, refreshLogo } = useLogo();
  const isLoading = isLogoLoading || contextLoading;
  
  const handleRefresh = () => {
    if (onRefreshLogo) {
      onRefreshLogo();
    } else {
      refreshLogo(websiteValue);
    }
  };

  return (
    <div className="relative flex flex-col items-center space-y-2">
      <CompanyLogo 
        website={websiteValue}
        companyName={companyNameValue}
        logoImage={logoImage}
        className="h-20 w-20"
        isLoading={isLoading}
      />
      <span className="text-sm text-muted-foreground">{companyNameValue || 'Company'}</span>
      
      {websiteValue && (
        <Button 
          size="sm" 
          variant="ghost" 
          className="absolute -top-2 -right-2 rounded-full h-6 w-6 p-1"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
          <span className="sr-only">Refresh Logo</span>
        </Button>
      )}
    </div>
  );
};
