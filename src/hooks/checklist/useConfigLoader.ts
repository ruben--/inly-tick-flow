
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CustomerType } from '@/components/configurator/CustomerTypeCard';
import { AssetType } from '@/components/configurator/AssetTypeCard';
import { MeterType } from '@/components/configurator/MeterTypeCard';
import { ConfigData } from './types';
import { defaultCustomerTypes, defaultAssetTypes, defaultMeterTypes } from './defaultData';

export function useConfigLoader(userId: string | undefined) {
  const [loading, setLoading] = useState(true);
  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>(defaultCustomerTypes);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>(defaultAssetTypes);
  const [meterTypes, setMeterTypes] = useState<MeterType[]>(defaultMeterTypes);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load user configuration from database
  useEffect(() => {
    const loadConfig = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_configs')
          .select('*')
          .eq('user_id', userId)
          .eq('config_type', 'checklist')
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const configData = data.config_data as unknown as ConfigData;
          if (configData && configData.customerTypes) {
            setCustomerTypes(prevTypes => 
              prevTypes.map(type => ({
                ...type,
                selected: configData.customerTypes.find(ct => ct.id === type.id)?.selected ?? type.selected
              }))
            );
          }
          
          if (configData && configData.assetTypes) {
            setAssetTypes(prevTypes => 
              prevTypes.map(type => ({
                ...type,
                selected: configData.assetTypes.find(at => at.id === type.id)?.selected ?? type.selected
              }))
            );
          }
          
          if (configData && configData.meterTypes) {
            setMeterTypes(prevTypes => 
              prevTypes.map(type => ({
                ...type,
                selected: configData.meterTypes.find(mt => mt.id === type.id)?.selected ?? type.selected
              }))
            );
          }

          setLastSaved(new Date(data.updated_at));
        }
      } catch (error: any) {
        console.error('Error loading configuration:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [userId]);

  return {
    loading,
    customerTypes,
    setCustomerTypes,
    assetTypes,
    setAssetTypes,
    meterTypes,
    setMeterTypes,
    lastSaved
  };
}
