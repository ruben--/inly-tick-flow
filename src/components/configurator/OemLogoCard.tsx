
import React from 'react';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { CompanyLogo } from "@/components/profile/CompanyLogo";
import { Check, X } from "lucide-react";

interface OemLogoCardProps {
  id: string;
  name: string;
  domain: string;
  logo: string | null;
  selected: boolean;
  onToggle: (id: string) => void;
}

export const OemLogoCard: React.FC<OemLogoCardProps> = ({
  id,
  name,
  domain,
  logo,
  selected,
  onToggle
}) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 flex flex-col items-center justify-between p-4 h-[140px] border-2 hover:border-primary relative overflow-hidden",
        selected ? "border-primary bg-primary/5" : "border-muted bg-background"
      )}
      onClick={() => onToggle(id)}
    >
      <div className="absolute top-2 right-2">
        {selected ? (
          <Check className="h-5 w-5 text-primary" />
        ) : (
          <X className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      <div className="h-16 w-16 flex items-center justify-center mb-2">
        <CompanyLogo 
          website={domain}
          companyName={name}
          className="h-full w-full"
        />
      </div>
      
      <div className="text-center mt-2">
        <p className="text-sm font-medium truncate">{name}</p>
      </div>
    </Card>
  );
};
