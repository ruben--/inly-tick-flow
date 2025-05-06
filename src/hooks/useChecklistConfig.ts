import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { CustomerType } from '@/components/configurator/CustomerTypeCard';
import { AssetType } from '@/components/configurator/AssetTypeCard';
import { MeterType } from '@/components/configurator/MeterTypeCard';

// Define a type for our config data that matches the Json type from Supabase
export type ConfigData = {
  customerTypes: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    selected: boolean;
  }>;
  assetTypes: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    selected: boolean;
  }>;
  meterTypes: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    selected: boolean;
  }>;
};

export type UseChecklistConfigResult = {
  loading: boolean;
  saving: boolean;
  lastSaved: Date | null;
  customerTypes: CustomerType[];
  assetTypes: AssetType[];
  meterTypes: MeterType[];
  toggleCustomerType: (id: string) => void;
  toggleAssetType: (id: string) => void;
  toggleMeterType: (id: string) => void;
  selectedCustomer: CustomerType | undefined;
  selectedAssetTypes: AssetType[];
  isAllCustomersSelected: boolean;
};

export const useChecklistConfig = (userId: string | undefined): UseChecklistConfigResult => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>([
    {
      id: 'commercial',
      name: 'Commerce & Industry',
      description: 'Such as data centers, solar parks, wind farms.',
      image: '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png',
      selected: false,
      website: 'https://commercial-industry.com',
    },
    {
      id: 'residential',
      name: 'Residential',
      description: 'Such as data centers, solar parks, wind farms.',
      image: '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png',
      selected: true,
      website: 'https://residential-energy.com',
    },
  ]);

  const [assetTypes, setAssetTypes] = useState<AssetType[]>([
    {
      id: 'bess',
      name: 'BESS',
      description: 'Such as data centres, solar parks, wind farms.',
      image: '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png',
      selected: true,
    },
    {
      id: 'ev',
      name: 'EV',
      description: 'Such as data centres, solar parks, wind farms.',
      image: '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png',
      selected: true,
    },
    {
      id: 'pv',
      name: 'PV',
      description: 'Such as data centres, solar parks, wind farms.',
      image: '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png',
      selected: false,
    },
  ]);

  const [meterTypes, setMeterTypes] = useState<MeterType[]>([
    {
      id: 'ftm',
      name: 'Front of the Meter',
      description: 'Grid-connected installations',
      image: '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png',
      selected: false,
    },
    {
      id: 'btm',
      name: 'Behind the Meter',
      description: 'Customer-side installations',
      image: '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png',
      selected: false,
    },
  ]);

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

  // Save configuration when it changes
  const saveConfig = async () => {
    if (!userId) return;
    
    try {
      setSaving(true);
      
      const configData = {
        customerTypes,
        assetTypes,
        meterTypes
      };
      
      const { data, error } = await supabase
        .from('user_configs')
        .select('id')
        .eq('user_id', userId)
        .eq('config_type', 'checklist')
        .maybeSingle();
      
      let saveError;
      
      if (data) {
        // Update existing config
        const { error: updateError } = await supabase
          .from('user_configs')
          .update({ 
            config_data: configData as any,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);
          
        saveError = updateError;
      } else {
        // Insert new config
        const { error: insertError } = await supabase
          .from('user_configs')
          .insert({
            user_id: userId,
            config_type: 'checklist',
            config_data: configData as any
          });
          
        saveError = insertError;
      }
      
      if (saveError) throw saveError;
      
      const now = new Date();
      setLastSaved(now);
      toast('Configuration saved', {
        description: `Last saved at ${now.toLocaleTimeString()}`
      });
    } catch (error: any) {
      console.error('Error saving configuration:', error.message);
      toast('Failed to save', {
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Debounced save effect
  useEffect(() => {
    if (!userId || loading) return;
    
    const timer = setTimeout(() => {
      saveConfig();
    }, 1000);
    
    return () => clearTimeout(timer);
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
  };
};
