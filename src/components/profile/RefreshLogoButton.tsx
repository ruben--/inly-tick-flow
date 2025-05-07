
import React, { useState } from "react";
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    
    toast.success("Logo refresh initiated", {
      description: "Fetching the latest company logo..."
    });
    
    // Reset the animation after a reasonable time
    setTimeout(() => setIsRefreshing(false), 2000);
  };
  
  return (
    <Button 
      type="button" 
      variant="outline" 
      size="sm"
      onClick={handleRefresh}
      disabled={isDisabled || isRefreshing}
      className="text-xs flex items-center gap-1 hover:bg-slate-100"
    >
      <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Refreshing...' : 'Refresh Logo'}
    </Button>
  );
};
