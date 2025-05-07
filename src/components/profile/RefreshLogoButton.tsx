
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// Component kept for compatibility but not currently used in the application
interface RefreshLogoButtonProps {
  onRefresh: () => void;
  isDisabled?: boolean;
}

export const RefreshLogoButton: React.FC<RefreshLogoButtonProps> = () => {
  return null; // Component not rendered as requested
};
