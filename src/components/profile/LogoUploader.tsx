
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, RefreshCw } from "lucide-react";

interface LogoUploaderProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRetry?: () => void;
  error?: string | null;
  showUploadButton?: boolean;
  showRetryButton?: boolean;
  website?: string;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  onFileChange,
  onRetry,
  error,
  showUploadButton = false,
  showRetryButton = false,
  website
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center">
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      
      <div className="flex gap-2 mt-2">
        {showUploadButton && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept="image/*"
              className="hidden"
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-1 h-4 w-4" /> Upload
            </Button>
          </>
        )}
        
        {showRetryButton && website && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
          >
            <RefreshCw className="mr-1 h-4 w-4" /> Retry
          </Button>
        )}
      </div>
    </div>
  );
};
