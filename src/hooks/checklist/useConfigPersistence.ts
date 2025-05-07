
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { ConfigData } from './types';
import { CustomerType } from '@/components/configurator/CustomerTypeCard';
import { AssetType } from '@/components/configurator/AssetTypeCard';
import { MeterType } from '@/components/configurator/MeterTypeCard';

export function useConfigPersistence(
  userId: string | undefined,
  customerTypes: CustomerType[],
  assetTypes: AssetType[],
  meterTypes: MeterType[],
  loading: boolean
) {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

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
  
  // Set up debounced save effect
  const debounceSave = (userId: string | undefined, loading: boolean) => {
    if (!userId || loading) return () => {};
    
    const timer = setTimeout(() => {
      saveConfig();
    }, 1000);
    
    return () => clearTimeout(timer);
  };

  return {
    saving,
    lastSaved,
    saveConfig,
    debounceSave
  };
}
