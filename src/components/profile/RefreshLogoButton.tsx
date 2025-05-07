
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Component kept for compatibility but no longer used in the application
interface RefreshLogoButtonProps {
  onRefresh: () => void;
  isDisabled?: boolean;
}

export const RefreshLogoButton: React.FC<RefreshLogoButtonProps> = ({
  onRefresh,
  isDisabled = false
}) => {
  return null; // Component not rendered
};
