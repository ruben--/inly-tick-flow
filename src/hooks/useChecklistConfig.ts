
import { useEffect } from 'react';
import { UseChecklistConfigResult } from './checklist/types';
import { useConfigLoader } from './checklist/useConfigLoader';
import { useConfigPersistence } from './checklist/useConfigPersistence';

// Fix the re-export to use explicit 'export type'
export type { ConfigData, UseChecklistConfigResult } from './checklist/types';

export const useChecklistConfig = (userId: string | undefined): UseChecklistConfigResult => {
  const {
    loading,
    customerTypes,
    setCustomerTypes,
    assetTypes, 
    setAssetTypes,
    meterTypes,
    setMeterTypes,
    lastSaved: loadedLastSaved
  } = useConfigLoader(userId);

  const {
    saving,
    lastSaved,
    debounceSave
  } = useConfigPersistence(userId, customerTypes, assetTypes, meterTypes, loading);

  // Debounced save effect
  useEffect(() => {
    return debounceSave(userId, loading);
  }, [customerTypes, assetTypes, meterTypes, userId, loading]);

  const toggleCustomerType = (id: string) => {
    setCustomerTypes(prevTypes => 
      prevTypes.map(type => ({
        ...type,
        selected: type.id === id ? !type.selected : type.selected
      }))
    );
  };

  const toggleAssetType = (id: string) => {
    setAssetTypes(prevTypes => 
      prevTypes.map(type => ({
        ...type,
        selected: type.id === id ? !type.selected : type.selected
      }))
    );
  };

  const toggleMeterType = (id: string) => {
    setMeterTypes(prevTypes => 
      prevTypes.map(type => ({
        ...type,
        selected: type.id === id ? !type.selected : type.selected
      }))
    );
  };

  const selectedCustomer = customerTypes.find(type => type.selected);
  const selectedAssetTypes = assetTypes.filter(type => type.selected);
  const isAllCustomersSelected = customerTypes.every(type => type.selected);

  return {
    loading,
    saving,
    lastSaved: lastSaved || loadedLastSaved,
    customerTypes,
    assetTypes,
    meterTypes,
    toggleCustomerType,
    toggleAssetType,
    toggleMeterType,
    selectedCustomer,
    selectedAssetTypes,
    isAllCustomersSelected
  };
};
