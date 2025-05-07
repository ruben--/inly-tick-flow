
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOemLogos } from '@/hooks/oem/useOemLogos';
import { useAuth } from '@/contexts/AuthContext';
import { ConfigHeader } from '@/components/configure/ConfigHeader';
import { ConfigFooter } from '@/components/configure/ConfigFooter';
import { GeneralTab } from '@/components/configure/tabs/GeneralTab';
import { EnergySourcesTab } from '@/components/configure/tabs/EnergySourcesTab';
import { ResponseModesTab } from '@/components/configure/tabs/ResponseModesTab';
import { ControlSettingsTab } from '@/components/configure/tabs/ControlSettingsTab';
import { OemsTab } from '@/components/configure/tabs/OemsTab';
import { useConfigState } from '@/components/configure/useConfigState';

const Configure = () => {
  const { user } = useAuth();
  const { oemLogos, loading: oemsLoading, toggleOem, saving: oemsSaving } = useOemLogos(user?.id);
  const { 
    config, 
    saving, 
    lastSaved,
    handleInputChange,
    handleSelectChange,
    handleResponseModeToggle,
    handleEnergySourceToggle,
    handleControlSettingChange,
    handleResetToDefaults
  } = useConfigState();

  return (
    <div className="space-y-6">
      <ConfigHeader saving={saving} lastSaved={lastSaved} />

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

      <ConfigFooter
        saving={saving}
        onResetToDefaults={handleResetToDefaults}
      />
    </div>
  );
};

export default Configure;
