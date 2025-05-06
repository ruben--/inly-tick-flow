
import { useAuth } from '@/contexts/AuthContext';
import { ConfigSidebar } from '@/components/configurator/ConfigSidebar';
import { MainContent } from '@/components/configurator/MainContent';
import { LoadingState } from '@/components/configurator/LoadingState';
import { SaveIndicator } from '@/components/configurator/SaveIndicator';
import { ProgressBar } from '@/components/configurator/ProgressBar';
import { useChecklistConfig } from '@/hooks/useChecklistConfig';
import { useState } from 'react';

const Checklist = () => {
  const { user } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  
  const {
    loading,
    saving,
    lastSaved,
    customerTypes,
    assetTypes,
    meterTypes,
    toggleCustomerType,
    toggleAssetType,
    toggleMeterType,
    selectedCustomer,
    selectedAssetTypes,
    isAllCustomersSelected
  } = useChecklistConfig(user?.id);

  if (loading) {
    return <LoadingState />;
  }

  // Calculate progress based on the four steps
  // Each step contributes to the progress
  const completedSteps = [
    isProfileComplete,                         // Profile step
    customerTypes.some(type => type.selected), // Customer types step
    assetTypes.some(type => type.selected),    // Assets step
    meterTypes.some(type => type.selected)     // Optimization step
  ];
  
  const completedCount = completedSteps.filter(Boolean).length;
  const totalSteps = 4; // Profile, Customer Types, Assets, Optimization
  
  // Calculate progress as a percentage of completed steps
  const progress = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="flex flex-col gap-6">
      <ProgressBar 
        progress={progress}
        completedTasks={completedCount}
        totalTasks={totalSteps}
        customerTypes={customerTypes}
        assetTypes={assetTypes}
        meterTypes={meterTypes}
        onProfileStatusChange={setIsProfileComplete}
      />
      
      <div className="flex flex-col md:flex-row gap-6">
        <ConfigSidebar 
          customerTypes={customerTypes}
          assetTypes={assetTypes}
          meterTypes={meterTypes}
          toggleCustomerType={toggleCustomerType}
          toggleAssetType={toggleAssetType}
          toggleMeterType={toggleMeterType}
        />
        <MainContent 
          selectedCustomer={selectedCustomer}
          selectedAssetTypes={selectedAssetTypes}
          isAllCustomersSelected={isAllCustomersSelected}
          meterTypes={meterTypes}
        />
        <SaveIndicator saving={saving} lastSaved={lastSaved} />
      </div>
    </div>
  );
};

export default Checklist;
