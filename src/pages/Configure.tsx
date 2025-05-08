
import { useAuth } from '@/contexts/AuthContext';
import { useOemLogos } from '@/hooks/oem/useOemLogos';
import { ConfigHeader } from '@/components/configure/ConfigHeader';
import { ConfigFooter } from '@/components/configure/ConfigFooter';
import { ConfigTabs } from '@/components/configure/ConfigTabs';
import { useConfigState } from '@/components/configure/useConfigState';
import { Card, CardContent } from '@/components/ui/card';
import { CompanyLogo } from '@/components/profile/CompanyLogo';
import { useProfileData } from '@/hooks/useProfileData';
import { useEffect } from 'react';

const Configure = () => {
  const { user } = useAuth();
  const { 
    oemLogos, 
    loading: oemsLoading, 
    toggleOem, 
    saving: oemsSaving, 
    prefetchAllLogos 
  } = useOemLogos(user?.id);
  
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
  
  const { 
    data: profileData,
    logoImage // Get logoImage from the hook return value 
  } = useProfileData({ userId: user?.id });
  
  // Trigger logo prefetch on initial load
  useEffect(() => {
    if (oemLogos.length > 0 && !oemsLoading) {
      prefetchAllLogos();
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ConfigHeader saving={saving} lastSaved={lastSaved} />
        
        {/* Company logo */}
        <Card className="p-2 flex items-center space-x-3">
          <CompanyLogo 
            companyName={profileData?.companyName || 'Company'} 
            website={profileData?.website || ''}
            logoImage={logoImage} // Use logoImage from the hook
            className="h-12 w-12" 
          />
          <div className="text-sm">
            <p className="font-medium">{profileData?.companyName || 'Your Company'}</p>
            <p className="text-muted-foreground text-xs">{profileData?.website || ''}</p>
          </div>
        </Card>
      </div>

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
