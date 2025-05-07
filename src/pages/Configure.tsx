
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOemLogos } from '@/hooks/oem/useOemLogos';
import { ConfigHeader } from '@/components/configure/ConfigHeader';
import { ConfigFooter } from '@/components/configure/ConfigFooter';
import { ConfigTabs } from '@/components/configure/ConfigTabs';
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

      <ConfigTabs
        config={config}
        oemLogos={oemLogos}
        oemsLoading={oemsLoading}
        oemsSaving={oemsSaving}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleResponseModeToggle={handleResponseModeToggle}
        handleEnergySourceToggle={handleEnergySourceToggle}
        handleControlSettingChange={handleControlSettingChange}
        toggleOem={toggleOem}
      />

      <ConfigFooter
        saving={saving}
        onResetToDefaults={handleResetToDefaults}
      />
    </div>
  );
};

export default Configure;
