
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface RefreshLogoButtonProps {
  onRefresh: () => void;
  isDisabled?: boolean;
}

export const RefreshLogoButton: React.FC<RefreshLogoButtonProps> = ({
  onRefresh,
  isDisabled = false
}) => {
  const handleRefresh = () => {
    onRefresh();
    toast.success("Logo refresh initiated", {
      description: "Fetching the latest company logo..."
    });
  };
  
  return (
    <Button 
      type="button" 
      variant="outline" 
      size="sm"
      onClick={handleRefresh}
      disabled={isDisabled}
      className="text-xs flex items-center gap-1 hover:bg-slate-100"
    >
      <RefreshCw className={`h-3 w-3 ${isDisabled ? '' : 'animate-spin-once'}`} />
      Refresh Logo
    </Button>
  );
};
