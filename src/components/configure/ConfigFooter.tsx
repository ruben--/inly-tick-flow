
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, RefreshCcw } from 'lucide-react';

interface ConfigFooterProps {
  saving: boolean;
  onResetToDefaults: () => void;
}

export const ConfigFooter: React.FC<ConfigFooterProps> = ({ saving, onResetToDefaults }) => {
  return (
    <div className="flex justify-end gap-4">
      <Button variant="outline" onClick={onResetToDefaults}>Reset to Defaults</Button>
      <Button disabled={saving}>
        {saving ? (
          <>
            <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Saved
          </>
        )}
      </Button>
    </div>
  );
};
