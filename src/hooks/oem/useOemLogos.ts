
import { useCallback, useEffect } from 'react';
import { OemType } from './types';
import { defaultOemData } from './defaultOemData';
import { useOemLogoPrefetch } from './useOemLogoPrefetch';
import { useOemLogosState } from './useOemLogosState';

export function useOemLogos(userId: string | undefined) {
  const { 
    oemLogos, 
    loading, 
    saving, 
    lastSaved, 
    toggleOem, 
    updateOemLogo,
    setOemLogos
  } = useOemLogosState(userId, defaultOemData);
  
  const { prefetchAllLogos, prefetchLoading } = useOemLogoPrefetch();

  // Update OEM logos and handle prefetching
  const prefetchAndUpdateLogos = useCallback(() => {
    if (!oemLogos.length) return;
    
    console.log("Triggering logo prefetch for", oemLogos.length, "OEMs");
    prefetchAllLogos(oemLogos, updateOemLogo);
  }, [oemLogos, prefetchAllLogos, updateOemLogo]);
  
  // Auto-prefetch logos when OEM data is loaded
  useEffect(() => {
    if (oemLogos.length > 0 && !loading && !prefetchLoading) {
      // Only prefetch for OEMs that don't have logos yet
      const needsPrefetch = oemLogos.some(oem => !oem.logo);
      
      if (needsPrefetch) {
        console.log("Auto-prefetching missing OEM logos");
        prefetchAndUpdateLogos();
      }
    }
  }, [oemLogos, loading, prefetchLoading, prefetchAndUpdateLogos]);

  return {
    oemLogos,
    loading: loading || prefetchLoading,
    saving,
    lastSaved,
    toggleOem,
    prefetchAllLogos: prefetchAndUpdateLogos
  };
}
