
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConfigState } from '../types';

interface ControlSettingsTabProps {
  config: ConfigState;
  handleControlSettingChange: (setting: keyof ConfigState['controlSettings'], value: string) => void;
}

export const ControlSettingsTab: React.FC<ControlSettingsTabProps> = ({
  config,
  handleControlSettingChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Control System Settings</CardTitle>
        <CardDescription>
          Configure the control parameters for your VPP
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="responseTime">Response Time (seconds)</Label>
            <Input 
              id="responseTime"
              type="number"
              value={config.controlSettings.responseTime}
              onChange={(e) => handleControlSettingChange('responseTime', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="autonomyLevel">Autonomy Level</Label>
            <Select 
              value={config.controlSettings.autonomyLevel} 
              onValueChange={(value) => handleControlSettingChange('autonomyLevel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select autonomy level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Mostly Manual Control</SelectItem>
                <SelectItem value="medium">Medium - Balanced Control</SelectItem>
                <SelectItem value="high">High - Highly Autonomous</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dispatchMethod">Dispatch Method</Label>
            <Select 
              value={config.controlSettings.dispatchMethod} 
              onValueChange={(value) => handleControlSettingChange('dispatchMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select dispatch method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual Dispatch</SelectItem>
                <SelectItem value="scheduled">Scheduled Dispatch</SelectItem>
                <SelectItem value="automatic">Automatic Dispatch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
