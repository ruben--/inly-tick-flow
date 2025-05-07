
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LogoPlaceholder } from "./LogoPlaceholder";
import { useBrandLogo } from "@/hooks/useBrandLogo";

interface CompanyLogoProps {
  website: string;
  companyName: string;
  logoImage?: string | null;
  className?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ 
  website, 
  companyName,
  logoImage,
  className = "h-16 w-16"
}) => {
  const {
    logoImage: fetchedLogoImage,
    isLoading,
    error
  } = useBrandLogo(logoImage ? '' : website);  // Only fetch if we don't have a logo image

  const initials = companyName
    ? companyName
        .split(' ')
        .map(word => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CO';

  // Use the provided logoImage if available, otherwise use the fetched one
  const displayedImage = logoImage || fetchedLogoImage;

  return (
    <div className="border border-gray-200 overflow-hidden rounded-md flex items-center justify-center" style={{ width: className.match(/w-\d+/)?.at(0), height: className.match(/h-\d+/)?.at(0) }}>
      <AspectRatio ratio={1}>
        {displayedImage ? (
          <img 
            src={displayedImage} 
            alt={companyName || "Company logo"} 
            className="object-contain p-1 w-full h-full"
            onError={() => {
              console.error("Failed to load image");
            }}
          />
        ) : (
          <LogoPlaceholder 
            initials={initials} 
            isLoading={isLoading} 
          />
        )}
      </AspectRatio>
    </div>
  );
};
