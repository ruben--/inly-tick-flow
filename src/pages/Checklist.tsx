
import { useAuth } from '@/contexts/AuthContext';
import { ConfigSidebar } from '@/components/configurator/ConfigSidebar';
import { MainContent } from '@/components/configurator/MainContent';
import { LoadingState } from '@/components/configurator/LoadingState';
import { SaveIndicator } from '@/components/configurator/SaveIndicator';
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

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
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
  );
};

export default Checklist;
