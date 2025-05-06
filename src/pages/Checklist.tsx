
import { useState, useEffect } from 'react';
import { ConfigSidebar } from '@/components/configurator/ConfigSidebar';
import { MainContent } from '@/components/configurator/MainContent';
import { CustomerType } from '@/components/configurator/CustomerTypeCard';
import { AssetType } from '@/components/configurator/AssetTypeCard';
import { MeterType } from '@/components/configurator/MeterTypeCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

const Checklist = () => {
  const { user } = useAuth();
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
    },
    {
      id: 'residential',
      name: 'Residential',
      description: 'Such as data centers, solar parks, wind farms.',
      image: '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png',
      selected: true,
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
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_configs')
          .select('*')
          .eq('user_id', user.id)
          .eq('config_type', 'checklist')
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const configData = data.config_data;
          if (configData.customerTypes) {
            setCustomerTypes(prevTypes => 
              prevTypes.map(type => ({
                ...type,
                selected: configData.customerTypes.find((ct: any) => ct.id === type.id)?.selected ?? type.selected
              }))
            );
          }
          
          if (configData.assetTypes) {
            setAssetTypes(prevTypes => 
              prevTypes.map(type => ({
                ...type,
                selected: configData.assetTypes.find((at: any) => at.id === type.id)?.selected ?? type.selected
              }))
            );
          }
          
          if (configData.meterTypes) {
            setMeterTypes(prevTypes => 
              prevTypes.map(type => ({
                ...type,
                selected: configData.meterTypes.find((mt: any) => mt.id === type.id)?.selected ?? type.selected
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
  }, [user]);

  // Save configuration when it changes
  const saveConfig = async () => {
    if (!user) return;
    
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
        .eq('user_id', user.id)
        .eq('config_type', 'checklist')
        .maybeSingle();
      
      let saveError;
      
      if (data) {
        // Update existing config
        const { error: updateError } = await supabase
          .from('user_configs')
          .update({ 
            config_data: configData,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);
          
        saveError = updateError;
      } else {
        // Insert new config
        const { error: insertError } = await supabase
          .from('user_configs')
          .insert({
            user_id: user.id,
            config_type: 'checklist',
            config_data: configData
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
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Debounced save effect
  useEffect(() => {
    if (!user || loading) return;
    
    const timer = setTimeout(() => {
      saveConfig();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [customerTypes, assetTypes, meterTypes, user]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <p className="text-muted-foreground">Loading your configuration...</p>
        </div>
      </div>
    );
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
      
      {/* Save indicator */}
      <div className="fixed bottom-4 right-4 flex items-center space-x-2 text-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur p-2 rounded-md shadow">
        <span className="text-muted-foreground">
          {saving ? (
            <>
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse mr-1.5"></span>
              Saving...
            </>
          ) : lastSaved ? (
            <>
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
              Saved at {lastSaved.toLocaleTimeString()}
            </>
          ) : (
            'Not saved yet'
          )}
        </span>
      </div>
    </div>
  );
};

export default Checklist;
