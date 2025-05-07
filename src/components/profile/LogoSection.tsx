
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyLogo } from "./CompanyLogo";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useLogo } from "@/contexts/LogoContext";

interface LogoSectionProps {
  userId?: string;
  websiteValue?: string;
  companyNameValue?: string;
  logoImage?: string | null;
  isLogoLoading?: boolean;
  onRefreshLogo?: () => void;
}

export const LogoSection: React.FC<LogoSectionProps> = ({
  userId,
  websiteValue = "",
  companyNameValue = "",
  logoImage,
  isLogoLoading = false,
  onRefreshLogo
}) => {
  const { isLoading: contextLoading, refreshLogo } = useLogo();
  const isLoading = isLogoLoading || contextLoading;
  
  const handleRefresh = () => {
    if (onRefreshLogo) {
      onRefreshLogo();
    } else if (websiteValue) {
      refreshLogo(websiteValue);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Logo</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative flex flex-col items-center space-y-2">
          <CompanyLogo 
            website={websiteValue}
            companyName={companyNameValue}
            logoImage={logoImage}
            className="h-20 w-20"
            isLoading={isLoading}
          />
          <span className="text-sm text-muted-foreground mt-2">{companyNameValue || 'Your Company'}</span>
          
          {websiteValue && (
            <Button 
              size="sm" 
              variant="outline"
              className="mt-4"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={`mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Refreshing..." : "Refresh Logo"}
            </Button>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-6">
          Your company logo is automatically generated based on your website.
        </p>
      </CardContent>
    </Card>
  );
};
