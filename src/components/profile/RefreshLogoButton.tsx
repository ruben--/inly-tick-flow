
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RefreshLogoButtonProps {
  onRefresh: () => void;
  isDisabled?: boolean;
}

export const RefreshLogoButton: React.FC<RefreshLogoButtonProps> = ({
  onRefresh,
  isDisabled = false
}) => {
  return (
    <Button 
      type="button" 
      variant="outline" 
      size="sm"
      onClick={onRefresh}
      disabled={isDisabled}
      className="text-xs flex items-center gap-1"
    >
      <RefreshCw className="h-3 w-3" />
      Refresh Logo
    </Button>
  );
};
