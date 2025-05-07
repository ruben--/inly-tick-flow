
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
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Enhanced debugging
  useEffect(() => {
    console.log("CompanyLogo render with logoImage:", logoImage ? "exists" : "null");
    console.log("CompanyLogo isLoading:", isLoading);
    console.log("CompanyLogo imageError:", imageError);
    console.log("CompanyLogo imageLoaded:", imageLoaded);
  }, [logoImage, isLoading, imageError, imageLoaded]);
  
  // Reset states when logo changes
  useEffect(() => {
    if (logoImage) {
      setImageError(false);
      setImageLoaded(false);
    }
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

  // Use the logo directly if available and not in error state
  const logoSrc = logoImage && !imageError ? logoImage : null;

  // Extract size classes
  const widthClass = className.match(/w-\d+/)?.at(0) || 'w-16';
  const heightClass = className.match(/h-\d+/)?.at(0) || 'h-16';

  return (
    <div 
      className={cn(
        "overflow-hidden rounded-md flex items-center justify-center bg-white",
        widthClass,
        heightClass,
        className,
        isLoading && "animate-pulse bg-gray-100"
      )}
      aria-label={`${companyName || "Company"} logo`}
      role="img"
    >
      <AspectRatio ratio={1}>
        {logoSrc && !isLoading && !imageError ? (
          <>
            {/* Show placeholder until image is loaded */}
            {!imageLoaded && (
              <LogoPlaceholder 
                initials={initials}
                isLoading={true} 
              />
            )}
            <img 
              src={logoSrc} 
              alt={companyName || "Company logo"} 
              className={cn(
                "object-contain p-1 w-full h-full",
                !imageLoaded && "opacity-0",
                imageLoaded && "opacity-100 transition-opacity duration-300"
              )}
              loading="lazy"
              decoding="async"
              onLoad={() => {
                console.log("Logo image loaded successfully");
                setImageLoaded(true);
              }}
              onError={(e) => {
                console.error("Logo image failed to load:", e);
                setImageError(true);
              }}
            />
          </>
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
