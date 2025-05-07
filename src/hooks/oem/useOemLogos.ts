
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { OemType } from './types';
import { defaultOemData } from './defaultOemData';
import { loadOemLogoData, saveOemLogoData } from './api/oemLogosApi';
import { useOemLogoPrefetch } from './useOemLogoPrefetch';

export function useOemLogos(userId: string | undefined) {
  const [oemLogos, setOemLogos] = useState<OemType[]>(defaultOemData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { prefetchAllLogos } = useOemLogoPrefetch();

  // Load OEM data from database
  useEffect(() => {
    const loadOemData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const data = await loadOemLogoData(userId);

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
          updateOemLogo();
        }
      } catch (error: any) {
        console.error('Error loading OEM data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadOemData();
  }, [userId]);

  // Update a single OEM logo
  const updateOemLogo = useCallback((updatedOem?: OemType, index?: number) => {
    if (updatedOem && typeof index === 'number') {
      setOemLogos(prevState => {
        const newState = [...prevState];
        newState[index] = updatedOem;
        return newState;
      });
    } else {
      // Start prefetching all logos if no specific OEM is provided
      prefetchAllLogos(oemLogos, (updatedOem, index) => {
        setOemLogos(prevState => {
          const newState = [...prevState];
          newState[index] = updatedOem;
          return newState;
        });
      });
    }
  }, [oemLogos, prefetchAllLogos]);

  // Save OEM data to database
  const saveOemData = async () => {
    if (!userId) return;
    
    try {
      setSaving(true);
      
      await saveOemLogoData(userId, oemLogos);
      
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
    prefetchAllLogos: updateOemLogo
  };
}
