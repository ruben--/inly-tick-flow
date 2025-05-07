
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LogoErrorAlertProps {
  error: string;
}

export const LogoErrorAlert: React.FC<LogoErrorAlertProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="py-2">
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertDescription className="text-sm">{error}</AlertDescription>
    </Alert>
  );
};
