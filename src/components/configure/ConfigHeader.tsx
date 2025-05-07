
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, RefreshCcw } from 'lucide-react';

interface ConfigHeaderProps {
  saving: boolean;
  lastSaved: string | null;
}

export const ConfigHeader: React.FC<ConfigHeaderProps> = ({ saving, lastSaved }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Configure Your VPP</h1>
          <p className="text-muted-foreground mt-1">
            Customize your virtual power plant settings
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {saving ? (
            <div className="flex items-center">
              <RefreshCcw className="h-4 w-4 mr-1 animate-spin" />
              <span>Saving changes...</span>
            </div>
          ) : lastSaved ? (
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
              <span>Saved at {lastSaved}</span>
            </div>
          ) : null}
        </div>
      </div>

      <Alert className="bg-muted/50">
        <AlertDescription>
          Your configuration is automatically saved as you make changes.
        </AlertDescription>
      </Alert>
    </>
  );
};
