
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RefreshCcw } from 'lucide-react';
import { OemLogosGrid } from '@/components/configurator/OemLogosGrid';
import { OemType } from '@/hooks/oem/types';

interface OemsTabProps {
  oemLogos: OemType[];
  toggleOem: (id: string) => void;
  loading: boolean;
  saving: boolean;
}

export const OemsTab: React.FC<OemsTabProps> = ({
  oemLogos,
  toggleOem,
  loading,
  saving
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>OEM Partners</CardTitle>
        <CardDescription>
          Select the original equipment manufacturers (OEMs) you work with
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-4">
            Click on the logos to enable or disable specific OEMs in your virtual power plant configuration.
            All selected OEMs will be integrated into your system.
          </p>
          
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium">OEM Partners</h3>
            <div className="flex items-center gap-2">
              {saving && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <RefreshCcw className="h-3 w-3 mr-1 animate-spin" />
                  <span>Saving...</span>
                </div>
              )}
            </div>
          </div>
          
          <OemLogosGrid 
            oemLogos={oemLogos} 
            onToggle={toggleOem}
            loading={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
};
