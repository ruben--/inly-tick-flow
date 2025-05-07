
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ConfigState } from '../types';

interface ResponseModesTabProps {
  config: ConfigState;
  handleResponseModeToggle: (mode: keyof ConfigState['responseModes']) => void;
}

export const ResponseModesTab: React.FC<ResponseModesTabProps> = ({
  config,
  handleResponseModeToggle
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grid Response Modes</CardTitle>
        <CardDescription>
          Configure how your VPP responds to grid conditions and signals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Demand Response</h3>
              <p className="text-sm text-muted-foreground">Respond to utility demand response events</p>
            </div>
            <Switch 
              checked={config.responseModes.demandResponse}
              onCheckedChange={() => handleResponseModeToggle('demandResponse')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Frequency Regulation</h3>
              <p className="text-sm text-muted-foreground">Provide grid frequency regulation services</p>
            </div>
            <Switch 
              checked={config.responseModes.frequencyRegulation}
              onCheckedChange={() => handleResponseModeToggle('frequencyRegulation')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Peak Shaving</h3>
              <p className="text-sm text-muted-foreground">Reduce peak load on the grid</p>
            </div>
            <Switch 
              checked={config.responseModes.peakShaving}
              onCheckedChange={() => handleResponseModeToggle('peakShaving')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Load Following</h3>
              <p className="text-sm text-muted-foreground">Dynamically adjust output based on load</p>
            </div>
            <Switch 
              checked={config.responseModes.loadFollowing}
              onCheckedChange={() => handleResponseModeToggle('loadFollowing')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
