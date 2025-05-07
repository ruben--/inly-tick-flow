
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConfigState } from '../types';

interface GeneralTabProps {
  config: ConfigState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({
  config,
  handleInputChange,
  handleSelectChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Configuration</CardTitle>
        <CardDescription>
          Configure the general settings for your virtual power plant
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vppName">VPP Name</Label>
            <Input 
              id="vppName"
              name="vppName"
              value={config.vppName}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacityMW">Capacity (MW)</Label>
            <Input 
              id="capacityMW"
              name="capacityMW"
              type="number"
              value={config.capacityMW}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Grid Location</Label>
            <Select 
              value={config.location} 
              onValueChange={(value) => handleSelectChange('location', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Western Grid">Western Grid</SelectItem>
                <SelectItem value="Eastern Grid">Eastern Grid</SelectItem>
                <SelectItem value="Northern Grid">Northern Grid</SelectItem>
                <SelectItem value="Southern Grid">Southern Grid</SelectItem>
                <SelectItem value="Island Mode">Island Mode</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gridConnectionType">Grid Connection Type</Label>
            <Select 
              value={config.gridConnectionType} 
              onValueChange={(value) => handleSelectChange('gridConnectionType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select connection type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transmission">Transmission Level</SelectItem>
                <SelectItem value="distribution">Distribution Level</SelectItem>
                <SelectItem value="microgrid">Microgrid</SelectItem>
                <SelectItem value="behindmeter">Behind-the-Meter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
