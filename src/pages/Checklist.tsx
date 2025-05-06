
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '@/components/configurator/LoadingState';
import { SaveIndicator } from '@/components/configurator/SaveIndicator';
import { ProgressBar } from '@/components/configurator/ProgressBar';
import { useChecklistConfig } from '@/hooks/useChecklistConfig';
import { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ConfigurationSidebar } from '@/components/configurator/ConfigurationSidebar';
import { MainContent } from '@/components/configurator/MainContent';

const Checklist = () => {
  const { user } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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

  // Ensure sidebar is open on component mount
  useEffect(() => {
    // Short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setSidebarOpen(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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
    <SidebarProvider defaultOpen={sidebarOpen}>
      <div className="flex min-h-svh w-full">
        <ConfigurationSidebar 
          customerTypes={customerTypes}
          assetTypes={assetTypes}
          meterTypes={meterTypes}
          toggleCustomerType={toggleCustomerType}
          toggleAssetType={toggleAssetType}
          toggleMeterType={toggleMeterType}
          completedSteps={completedSteps}
        />
        
        <div className="flex flex-col w-full gap-6 p-6">
          <ProgressBar 
            progress={progress}
            completedTasks={completedCount}
            totalTasks={totalSteps}
            customerTypes={customerTypes}
            assetTypes={assetTypes}
            meterTypes={meterTypes}
            onProfileStatusChange={setIsProfileComplete}
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
    </SidebarProvider>
  );
};

export default Checklist;
