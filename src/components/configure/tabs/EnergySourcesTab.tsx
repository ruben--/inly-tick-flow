
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ConfigState } from '../types';

interface EnergySourcesTabProps {
  config: ConfigState;
  handleEnergySourceToggle: (source: keyof ConfigState['energySources']) => void;
}

export const EnergySourcesTab: React.FC<EnergySourcesTabProps> = ({
  config,
  handleEnergySourceToggle
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Sources</CardTitle>
        <CardDescription>
          Configure the energy sources that make up your virtual power plant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Solar PV Systems</h3>
              <p className="text-sm text-muted-foreground">Include solar photovoltaic systems in your VPP</p>
            </div>
            <Switch 
              checked={config.energySources.solar}
              onCheckedChange={() => handleEnergySourceToggle('solar')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Wind Turbines</h3>
              <p className="text-sm text-muted-foreground">Include wind generation in your VPP</p>
            </div>
            <Switch 
              checked={config.energySources.wind}
              onCheckedChange={() => handleEnergySourceToggle('wind')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Battery Storage</h3>
              <p className="text-sm text-muted-foreground">Include battery energy storage systems</p>
            </div>
            <Switch 
              checked={config.energySources.batteries}
              onCheckedChange={() => handleEnergySourceToggle('batteries')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Backup Generators</h3>
              <p className="text-sm text-muted-foreground">Include fossil fuel or biofuel generators</p>
            </div>
            <Switch 
              checked={config.energySources.generators}
              onCheckedChange={() => handleEnergySourceToggle('generators')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
