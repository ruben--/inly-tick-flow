
import { useAuth } from '@/contexts/AuthContext';
import { ConfigSidebar } from '@/components/configurator/ConfigSidebar';
import { MainContent } from '@/components/configurator/MainContent';
import { LoadingState } from '@/components/configurator/LoadingState';
import { SaveIndicator } from '@/components/configurator/SaveIndicator';
import { ProgressBar } from '@/components/configurator/ProgressBar';
import { useChecklistConfig } from '@/hooks/useChecklistConfig';

const Checklist = () => {
  const { user } = useAuth();
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

  // Calculate progress for the progress bar
  const totalItems = customerTypes.length + assetTypes.length + meterTypes.length;
  const completedItems = 
    customerTypes.filter(ct => ct.selected).length +
    assetTypes.filter(at => at.selected).length +
    meterTypes.filter(mt => mt.selected).length;
  
  const progress = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="flex flex-col gap-6">
      <ProgressBar 
        progress={progress}
        completedTasks={completedItems}
        totalTasks={totalItems}
        customerTypes={customerTypes}
        assetTypes={assetTypes}
        meterTypes={meterTypes}
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
