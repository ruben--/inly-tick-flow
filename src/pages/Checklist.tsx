
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '@/components/configurator/LoadingState';
import { SaveIndicator } from '@/components/configurator/SaveIndicator';
import { ProgressBar } from '@/components/configurator/ProgressBar';
import { useChecklistConfig } from '@/hooks/useChecklistConfig';
import { useState } from 'react';
import { ConfigurationSidebar } from '@/components/configurator/ConfigurationSidebar';
import { MainContent } from '@/components/configurator/MainContent';

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
    <div className="flex h-svh bg-te-gray-50">
      {/* Sidebar fixed on the left side - TE style */}
      <div className="w-80 border-r-2 border-black flex-shrink-0 overflow-y-auto bg-te-gray-100 h-full">
        <ConfigurationSidebar 
          customerTypes={customerTypes}
          assetTypes={assetTypes}
          meterTypes={meterTypes}
          toggleCustomerType={toggleCustomerType}
          toggleAssetType={toggleAssetType}
          toggleMeterType={toggleMeterType}
          completedSteps={completedSteps}
        />
      </div>
      
      {/* Main Content Area - TE style */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <ProgressBar 
              progress={progress}
              completedTasks={completedCount}
              totalTasks={totalSteps}
              customerTypes={customerTypes}
              assetTypes={assetTypes}
              meterTypes={meterTypes}
              onProfileStatusChange={setIsProfileComplete}
            />
          </div>
        </div>
        
        <div className="flex-1 p-6 pt-4 overflow-auto h-full">
          <MainContent 
            selectedCustomer={selectedCustomer}
            selectedAssetTypes={selectedAssetTypes}
            isAllCustomersSelected={isAllCustomersSelected}
            meterTypes={meterTypes}
          />
        </div>
        
        <div className="p-6 pt-0">
          <SaveIndicator saving={saving} lastSaved={lastSaved} />
        </div>
      </div>
    </div>
  );
};

export default Checklist;
