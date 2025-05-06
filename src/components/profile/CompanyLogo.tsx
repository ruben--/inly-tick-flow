
import React, { useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Building } from "lucide-react";
import { fetchCompanyBranding, getBestLogo } from "@/utils/brandfetch";

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
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
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
    const fetchLogo = async () => {
      if (!website) {
        setLogoUrl(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const brandingData = await fetchCompanyBranding(website);
        const logo = getBestLogo(brandingData);
        setLogoUrl(logo);
      } catch (err) {
        console.error("Error fetching logo:", err);
        setError("Failed to fetch company logo");
        setLogoUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogo();
  }, [website]);

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
            <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500 text-lg">
              {isLoading ? (
                <div className="animate-pulse rounded-none bg-gray-300 h-full w-full" />
              ) : (
                initials || <Building className="h-10 w-10" />
              )}
            </div>
          )}
        </AspectRatio>
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};
