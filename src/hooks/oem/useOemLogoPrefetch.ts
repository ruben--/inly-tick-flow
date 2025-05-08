
import { useState, useCallback } from 'react';
import { OemType } from './types';
import { fetchOemLogo } from './api/oemLogosApi';

export function useOemLogoPrefetch() {
  const [prefetchLoading, setPrefetchLoading] = useState(false);

  // Prefetch logos for a single OEM
  const prefetchLogo = useCallback(async (oem: OemType): Promise<OemType> => {
    try {
      // Skip if logo already exists
      if (oem.logo) return oem;
      
      const logoImage = await fetchOemLogo(oem.domain);
      
      if (logoImage) {
        return { ...oem, logo: logoImage };
      }
      
      return oem;
    } catch (error) {
      console.error(`Error fetching logo for ${oem.name}:`, error);
      return oem;
    }
  }, []);

  // Prefetch all logos
  const prefetchAllLogos = useCallback(async (
    oemLogos: OemType[], 
    updateLogo: (updatedOem: OemType, index: number) => void
  ) => {
    if (prefetchLoading) return;
    
    setPrefetchLoading(true);
    
    // Process in batches to avoid overwhelming the API
    const processBatch = async (startIndex: number, batchSize: number) => {
      if (startIndex >= oemLogos.length) {
        setPrefetchLoading(false);
        return;
      }
      
      const batch = oemLogos.slice(startIndex, startIndex + batchSize);
      
      try {
        for (let i = 0; i < batch.length; i++) {
          const updatedOem = await prefetchLogo(batch[i]);
          updateLogo(updatedOem, startIndex + i);
        }
      } catch (error) {
        console.error('Error processing logo batch:', error);
      }
      
      // Process next batch
      setTimeout(() => {
        processBatch(startIndex + batchSize, batchSize);
      }, 1000); // 1 second delay between batches
    };
    
    // Start with first batch
    processBatch(0, 5);
  }, [prefetchLoading, prefetchLogo]);

  return {
    prefetchLoading,
    prefetchLogo,
    prefetchAllLogos
  };
}
