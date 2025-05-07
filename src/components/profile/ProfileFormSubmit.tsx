
import React from "react";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "./CompanyLogo";

interface ProfileFormSubmitProps {
  isLoading: boolean;
  websiteValue: string;
  companyNameValue: string;
  logoUrl: string | null;
  logoImage: string | null;
  fetchAttempted: boolean;
  websiteChanged: boolean;
  onLogoFound: (logoUrl: string | null, imageData?: string | null) => void;
  onLogoUpload: (imageData: string) => void;
  children: React.ReactNode;
}

export const ProfileFormSubmit: React.FC<ProfileFormSubmitProps> = ({
  isLoading,
  websiteValue,
  companyNameValue,
  logoUrl,
  logoImage,
  fetchAttempted,
  websiteChanged,
  onLogoFound,
  onLogoUpload,
  children
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <CompanyLogo 
          website={websiteValue}
          companyName={companyNameValue}
          className="h-20 w-20"
          onLogoFound={onLogoFound}
          logoUrl={!websiteChanged ? logoUrl : null}
          logoImage={logoImage}
          fetchAttempted={websiteChanged ? false : fetchAttempted}
          onLogoUpload={onLogoUpload}
          showUploadButton={true}
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
