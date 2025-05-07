
import React from "react";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "./CompanyLogo";

interface ProfileFormSubmitProps {
  isLoading: boolean;
  websiteValue: string;
  companyNameValue: string;
  logoImage?: string | null;
  children: React.ReactNode;
}

export const ProfileFormSubmit: React.FC<ProfileFormSubmitProps> = ({
  isLoading,
  websiteValue,
  companyNameValue,
  logoImage,
  children
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <CompanyLogo 
          website={websiteValue}
          companyName={companyNameValue}
          logoImage={logoImage}
          className="h-20 w-20"
        />
        
        <div className="flex-1 w-full">
          {children}
        </div>
      </div>
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Profile"}
      </Button>
    </>
  );
};
