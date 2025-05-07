
import React from "react";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "./CompanyLogo";
import { RefreshCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="relative flex flex-col items-center">
          <CompanyLogo 
            website={websiteValue}
            companyName={companyNameValue}
            logoImage={logoImage}
            className="h-20 w-20"
            isLoading={isLogoLoading}
          />
          
          {websiteValue && onRefreshLogo && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button"
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      onRefreshLogo();
                    }}
                    disabled={isLoading || isLogoLoading}
                    aria-label="Refresh logo"
                  >
                    <RefreshCcw className={`h-4 w-4 ${isLogoLoading ? 'animate-spin' : ''}`} />
                    <span className="sr-only">Refresh logo</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isLogoLoading ? 'Loading...' : 'Refresh logo'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <div className="flex-1 w-full">
          {children}
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading}
        className="relative"
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        )}
        <span className={isLoading ? "invisible" : ""}>
          {isLoading ? "Saving..." : "Save Profile"}
        </span>
      </Button>
    </>
  );
};
