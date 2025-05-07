
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LogoPlaceholder } from "./LogoPlaceholder";
import { LogoUploader } from "./LogoUploader";
import { useCompanyLogo } from "@/hooks/useCompanyLogo";

interface CompanyLogoProps {
  website: string;
  companyName: string;
  className?: string;
  onLogoFound?: (logoUrl: string | null, imageData?: string | null) => void;
  logoUrl?: string | null;
  logoImage?: string | null;
  fetchAttempted?: boolean;
  onLogoUpload?: (imageData: string) => void;
  showUploadButton?: boolean;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ 
  website, 
  companyName,
  className = "h-16 w-16",
  onLogoFound,
  logoUrl: initialLogoUrl,
  logoImage: initialLogoImage,
  fetchAttempted: initialFetchAttempted = false,
  onLogoUpload,
  showUploadButton = false
}) => {
  const {
    logoUrl,
    logoImage,
    isLoading,
    error,
    fetchAttempted,
    handleRetryFetch
  } = useCompanyLogo({
    website,
    initialLogoUrl,
    initialLogoImage,
    initialFetchAttempted,
    onLogoFound
  });

  console.log("CompanyLogo rendering with:", { 
    hasLogoImage: !!logoImage, 
    hasLogoUrl: !!logoUrl, 
    fetchAttempted 
  });

  const initials = companyName
    ? companyName
        .split(' ')
        .map(word => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CO';

  // Handle logo file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      // Call the callback with the new image data
      if (onLogoUpload) {
        onLogoUpload(base64String);
      }
      
      // Also call onLogoFound if provided
      if (onLogoFound) {
        onLogoFound(null, base64String);
      }
      
      // Clear the file input
      if (event.target) {
        event.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={`border border-gray-200 overflow-hidden rounded-md ${className}`}>
        <AspectRatio ratio={1}>
          {!isLoading && logoImage ? (
            <img 
              src={logoImage} 
              alt={companyName || "Company logo"} 
              className="object-contain p-1 w-full h-full"
            />
          ) : !isLoading && logoUrl ? (
            <img 
              src={logoUrl} 
              alt={companyName || "Company logo"} 
              className="object-contain p-1 w-full h-full"
              onLoad={async () => {
                // After successful load, convert to base64 for storage if we haven't done so already
                if (!logoImage && onLogoFound) {
                  console.log("Image loaded successfully, converting to base64");
                  const response = await fetch(logoUrl);
                  const blob = await response.blob();
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const imageData = reader.result as string;
                    if (imageData) {
                      if (onLogoFound) onLogoFound(logoUrl, imageData);
                    }
                  };
                  reader.readAsDataURL(blob);
                }
              }}
              onError={() => {
                console.error("Failed to load image from URL:", logoUrl);
                if (handleRetryFetch) handleRetryFetch();
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
      
      <LogoUploader
        onFileChange={handleFileChange}
        onRetry={handleRetryFetch}
        error={error}
        showUploadButton={showUploadButton}
        showRetryButton={!!website && fetchAttempted && !!error}
        website={website}
      />
    </div>
  );
};
