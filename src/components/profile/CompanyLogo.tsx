
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LogoPlaceholder } from "./LogoPlaceholder";
import { useBrandLogo } from "@/hooks/useBrandLogo";

interface CompanyLogoProps {
  website: string;
  companyName: string;
  className?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ 
  website, 
  companyName,
  className = "h-16 w-16"
}) => {
  const {
    logoUrl,
    isLoading,
    error
  } = useBrandLogo(website);

  const initials = companyName
    ? companyName
        .split(' ')
        .map(word => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CO';

  return (
    <div className="border border-gray-200 overflow-hidden rounded-md flex items-center justify-center" style={{ width: className.match(/w-\d+/)?.at(0), height: className.match(/h-\d+/)?.at(0) }}>
      <AspectRatio ratio={1}>
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={companyName || "Company logo"} 
            className="object-contain p-1 w-full h-full"
            onError={() => {
              console.error("Failed to load image from URL:", logoUrl);
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
