
import React, { useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LogoPlaceholder } from "./LogoPlaceholder";
import { cn } from "@/lib/utils";
import { useLogo } from "@/contexts/LogoContext";

interface CompanyLogoProps {
  website?: string;
  companyName: string;
  logoImage?: string | null;
  className?: string;
  isLoading?: boolean;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ 
  companyName,
  logoImage: propLogo,
  className = "h-16 w-16",
  isLoading: propLoading = false
}) => {
  const { logoImage: contextLogo, isLoading: contextLoading } = useLogo();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Determine which logo to use (prop or context)
  const logoSrc = (propLogo || contextLogo) && !imageError ? (propLogo || contextLogo) : null;
  const isLoading = propLoading || contextLoading;
  
  // Reset states when logo changes
  useEffect(() => {
    if (logoSrc) {
      setImageError(false);
      setImageLoaded(false);
    }
  }, [logoSrc]);
  
  // Extract initials for placeholder
  const initials = companyName
    ? companyName
        .split(' ')
        .map(word => word?.[0] || '')
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CO';

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
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
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
