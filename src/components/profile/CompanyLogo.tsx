
import React, { useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LogoPlaceholder } from "./LogoPlaceholder";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  website: string;
  companyName: string;
  logoImage?: string | null;
  className?: string;
  isLoading?: boolean;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ 
  website, 
  companyName,
  logoImage,
  className = "h-16 w-16",
  isLoading = false
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Reset error state when logo changes
  useEffect(() => {
    setImageError(false);
  }, [logoImage]);
  
  // Extract initials for placeholder
  const initials = companyName
    ? companyName
        .split(' ')
        .map(word => word?.[0] || '')
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CO';

  // Add cache-busting timestamp
  const logoSrc = logoImage && !imageError ? 
    `${logoImage}${logoImage.includes('?') ? '&' : '?'}t=${Date.now()}` : 
    null;

  // Extract size classes
  const widthClass = className.match(/w-\d+/)?.at(0) || 'w-16';
  const heightClass = className.match(/h-\d+/)?.at(0) || 'h-16';

  return (
    <div 
      className={cn(
        "overflow-hidden rounded-md flex items-center justify-center bg-white",
        widthClass,
        heightClass,
        isLoading && "animate-pulse bg-gray-100"
      )}
      aria-label={`${companyName || "Company"} logo`}
      role="img"
    >
      <AspectRatio ratio={1}>
        {logoSrc && !isLoading && !imageError ? (
          <img 
            src={logoSrc} 
            alt={companyName || "Company logo"} 
            className="object-contain p-1 w-full h-full"
            onError={() => setImageError(true)}
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
