
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { OemType } from './types';
import { defaultOemData } from './defaultOemData';

export function useOemLogos(userId: string | undefined) {
  const [oemLogos, setOemLogos] = useState<OemType[]>(defaultOemData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load OEM data from database
  useEffect(() => {
    const loadOemData = async () => {
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
          .eq('config_type', 'oem_logos')
          .maybeSingle();

        if (error) throw error;

        if (data) {
          // Merge saved data with defaults to ensure we have all the latest OEMs
          const savedData = data.config_data as { oemLogos: OemType[] };
          const savedMap = new Map(savedData.oemLogos.map(oem => [oem.id, oem]));
          
          setOemLogos(
            defaultOemData.map(defaultOem => ({
              ...defaultOem,
              logo: savedMap.get(defaultOem.id)?.logo || defaultOem.logo,
              selected: savedMap.has(defaultOem.id) 
                ? savedMap.get(defaultOem.id)!.selected 
                : defaultOem.selected
            }))
          );

          if (data.updated_at) {
            setLastSaved(new Date(data.updated_at));
          }
        } else {
          // If no data exists yet, prefetch the logos
          prefetchAllLogos();
        }
      } catch (error: any) {
        console.error('Error loading OEM data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadOemData();
  }, [userId]);

  // Save OEM data to database
  const saveOemData = async () => {
    if (!userId) return;
    
    try {
      setSaving(true);
      
      const { data, error } = await supabase
        .from('user_configs')
        .select('id')
        .eq('user_id', userId)
        .eq('config_type', 'oem_logos')
        .maybeSingle();
      
      let saveError;
      
      if (data) {
        // Update existing config
        const { error: updateError } = await supabase
          .from('user_configs')
          .update({ 
            config_data: { oemLogos },
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
            config_type: 'oem_logos',
            config_data: { oemLogos }
          });
          
        saveError = insertError;
      }
      
      if (saveError) throw saveError;
      
      const now = new Date();
      setLastSaved(now);
    } catch (error: any) {
      console.error('Error saving OEM data:', error.message);
      toast({
        title: 'Failed to save',
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  // Toggle OEM selection
  const toggleOem = useCallback((id: string) => {
    setOemLogos(prevState => 
      prevState.map(oem => 
        oem.id === id ? { ...oem, selected: !oem.selected } : oem
      )
    );
  }, []);

  // Prefetch logos for a single OEM
  const prefetchLogo = useCallback(async (oem: OemType): Promise<OemType> => {
    try {
      // Skip if logo already exists
      if (oem.logo) return oem;
      
      const response = await supabase.functions.invoke('fetch-brand-logo', {
        body: { website: oem.domain }
      });
      
      if (response.error) throw response.error;
      
      if (response.data?.logoImage) {
        return { ...oem, logo: response.data.logoImage };
      }
      
      return oem;
    } catch (error) {
      console.error(`Error fetching logo for ${oem.name}:`, error);
      return oem;
    }
  }, []);

  // Prefetch all logos
  const prefetchAllLogos = useCallback(async () => {
    // Process in batches to avoid overwhelming the API
    const processBatch = async (startIndex: number, batchSize: number) => {
      if (startIndex >= oemLogos.length) {
        return;
      }
      
      const batch = oemLogos.slice(startIndex, startIndex + batchSize);
      const updatedBatch = await Promise.all(batch.map(prefetchLogo));
      
      // Update state with the fetched logos
      setOemLogos(prevLogos => {
        const newLogos = [...prevLogos];
        for (let i = 0; i < updatedBatch.length; i++) {
          newLogos[startIndex + i] = updatedBatch[i];
        }
        return newLogos;
      });
      
      // Process next batch
      setTimeout(() => {
        processBatch(startIndex + batchSize, batchSize);
      }, 1000); // 1 second delay between batches
    };
    
    // Start with first batch
    processBatch(0, 5);
  }, [oemLogos, prefetchLogo]);

  // Save OEM data when it changes (with debounce)
  useEffect(() => {
    if (!userId || loading) return;
    
    const timer = setTimeout(() => {
      saveOemData();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [oemLogos, userId, loading]);

  return {
    oemLogos,
    loading,
    saving,
    lastSaved,
    toggleOem,
    prefetchAllLogos
  };
}
