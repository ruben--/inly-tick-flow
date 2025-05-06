
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  className = "h-20 w-20"
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
      <Avatar className={className}>
        {!isLoading && logoUrl ? (
          <AvatarImage src={logoUrl} alt={companyName || "Company logo"} className="object-contain p-1" />
        ) : null}
        <AvatarFallback className="bg-gray-100 text-gray-500 text-lg">
          {isLoading ? (
            <div className="animate-pulse rounded-full bg-gray-300 h-full w-full" />
          ) : (
            initials || <Building className="h-10 w-10" />
          )}
        </AvatarFallback>
      </Avatar>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};
