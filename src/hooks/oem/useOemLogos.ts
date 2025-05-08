
import { useCallback } from 'react';
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

    prefetchAllLogos(oemLogos, updateOemLogo);
  }, [oemLogos, prefetchAllLogos, updateOemLogo]);

  return {
    oemLogos,
    loading: loading || prefetchLoading,
    saving,
    lastSaved,
    toggleOem,
    prefetchAllLogos: prefetchAndUpdateLogos
  };
}
