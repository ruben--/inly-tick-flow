
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface LogoPlaceholderProps {
  initials: string;
  isLoading: boolean;
  className?: string;
}

export const LogoPlaceholder: React.FC<LogoPlaceholderProps> = ({ 
  initials, 
  isLoading,
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-center w-full h-full bg-gray-100 text-gray-500 ${className}`}>
      {isLoading ? (
        <div className="animate-pulse rounded-none bg-gray-300 h-full w-full" />
      ) : (
        <span className="text-lg font-medium">{initials}</span>
      )}
    </div>
  );
};
