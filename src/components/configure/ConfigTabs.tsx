
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralTab } from '@/components/configure/tabs/GeneralTab';
import { EnergySourcesTab } from '@/components/configure/tabs/EnergySourcesTab';
import { ResponseModesTab } from '@/components/configure/tabs/ResponseModesTab';
import { ControlSettingsTab } from '@/components/configure/tabs/ControlSettingsTab';
import { OemsTab } from '@/components/configure/tabs/OemsTab';
import { ConfigState } from './types';
import { OemType } from '@/hooks/oem/types';

interface ConfigTabsProps {
  config: ConfigState;
  oemLogos: OemType[];
  oemsLoading: boolean;
  oemsSaving: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleResponseModeToggle: (mode: keyof ConfigState['responseModes']) => void;
  handleEnergySourceToggle: (source: keyof ConfigState['energySources']) => void;
  handleControlSettingChange: (setting: keyof ConfigState['controlSettings'], value: string) => void;
  toggleOem: (id: string) => void;
}

export const ConfigTabs: React.FC<ConfigTabsProps> = ({
  config,
  oemLogos,
  oemsLoading,
  oemsSaving,
  handleInputChange,
  handleSelectChange,
  handleResponseModeToggle,
  handleEnergySourceToggle,
  handleControlSettingChange,
  toggleOem
}) => {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid grid-cols-5 mb-8">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="energy-sources">Energy Sources</TabsTrigger>
        <TabsTrigger value="response-modes">Response Modes</TabsTrigger>
        <TabsTrigger value="control">Control Settings</TabsTrigger>
        <TabsTrigger value="oems">OEMs</TabsTrigger>
      </TabsList>

      {/* General Tab */}
      <TabsContent value="general" className="space-y-4">
        <GeneralTab 
          config={config}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
      </TabsContent>

      {/* Energy Sources Tab */}
      <TabsContent value="energy-sources" className="space-y-4">
        <EnergySourcesTab
          config={config}
          handleEnergySourceToggle={handleEnergySourceToggle}
        />
      </TabsContent>

      {/* Response Modes Tab */}
      <TabsContent value="response-modes" className="space-y-4">
        <ResponseModesTab
          config={config}
          handleResponseModeToggle={handleResponseModeToggle}
        />
      </TabsContent>

      {/* Control Settings Tab */}
      <TabsContent value="control" className="space-y-4">
        <ControlSettingsTab
          config={config}
          handleControlSettingChange={handleControlSettingChange}
        />
      </TabsContent>
      
      {/* OEMs Tab */}
      <TabsContent value="oems" className="space-y-4">
        <OemsTab
          oemLogos={oemLogos}
          toggleOem={toggleOem}
          loading={oemsLoading}
          saving={oemsSaving}
        />
      </TabsContent>
    </Tabs>
  );
};
