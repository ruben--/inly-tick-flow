
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export interface ProfileFormSubmitProps {
  isLoading: boolean;
  websiteValue: string;
  companyNameValue: string;
  children?: ReactNode;
}

export const ProfileFormSubmit = ({ isLoading, websiteValue, companyNameValue, children }: ProfileFormSubmitProps) => {
  const isValidWebsite = websiteValue.trim() !== '';
  const isValidCompanyName = companyNameValue.trim() !== '';
  const isValid = isValidWebsite && isValidCompanyName;

  return (
    <div className="flex items-center justify-between mt-6">
      <div>
        {children}
      </div>
      <Button 
        disabled={!isValid || isLoading} 
        type="submit" 
        className="ml-auto"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};
