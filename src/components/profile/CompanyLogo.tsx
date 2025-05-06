
import React, { useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Building } from "lucide-react";
import { fetchCompanyBranding, getBestLogo } from "@/utils/brandfetch";

interface CompanyLogoProps {
  website: string;
  companyName: string;
  className?: string;
  onLogoFound?: (logoUrl: string | null) => void;
  logoUrl?: string | null;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ 
  website, 
  companyName,
  className = "h-16 w-16",
  onLogoFound,
  logoUrl: initialLogoUrl
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = companyName
    ? companyName
        .split(' ')
        .map(word => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CO';

  useEffect(() => {
    // If we already have a logo URL from props, don't fetch another one
    if (initialLogoUrl) {
      setLogoUrl(initialLogoUrl);
      if (onLogoFound) onLogoFound(initialLogoUrl);
      return;
    }

    const fetchLogo = async () => {
      if (!website) {
        setLogoUrl(null);
        if (onLogoFound) onLogoFound(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const brandingData = await fetchCompanyBranding(website);
        const logo = getBestLogo(brandingData);
        setLogoUrl(logo);
        
        // Call the callback when we find a logo
        if (onLogoFound) onLogoFound(logo);
      } catch (err) {
        console.error("Error fetching logo:", err);
        setError("Failed to fetch company logo");
        setLogoUrl(null);
        if (onLogoFound) onLogoFound(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogo();
  }, [website, onLogoFound, initialLogoUrl]);

  return (
    <div className="flex flex-col items-center">
      <div className={`border border-gray-200 overflow-hidden ${className}`}>
        <AspectRatio ratio={1}>
          {!isLoading && logoUrl ? (
            <img 
              src={logoUrl} 
              alt={companyName || "Company logo"} 
              className="object-contain p-1 w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
              {isLoading ? (
                <div className="animate-pulse rounded-none bg-gray-300 h-full w-full" />
              ) : (
                <span className="text-lg font-medium">{initials}</span>
              )}
            </div>
          )}
        </AspectRatio>
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};
