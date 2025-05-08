
import { useState, useCallback } from 'react';
import { OemType } from './types';
import { fetchOemLogo } from './api/oemLogosApi';
import { useBrandLogo } from '../useBrandLogo';

export function useOemLogoPrefetch() {
  const [prefetchLoading, setPrefetchLoading] = useState(false);
  const [currentPrefetches, setCurrentPrefetches] = useState<{[domain: string]: boolean}>({});

  // Prefetch logos for a single OEM
  const prefetchLogo = useCallback(async (oem: OemType): Promise<OemType> => {
    try {
      // Skip if logo already exists
      if (oem.logo) return oem;
      
      // Skip if already prefetching this domain
      if (currentPrefetches[oem.domain]) return oem;
      
      setCurrentPrefetches(prev => ({...prev, [oem.domain]: true}));
      
      console.log(`Prefetching logo for ${oem.name} (${oem.domain})...`);
      const logoImage = await fetchOemLogo(oem.domain);
      
      console.log(`Logo fetch result for ${oem.name}:`, logoImage ? "Success" : "Not found");
      
      if (logoImage) {
        return { ...oem, logo: logoImage };
      }
      
      return oem;
    } catch (error) {
      console.error(`Error fetching logo for ${oem.name}:`, error);
      return oem;
    } finally {
      setCurrentPrefetches(prev => {
        const updated = {...prev};
        delete updated[oem.domain];
        return updated;
      });
    }
  }, [currentPrefetches]);

  // Prefetch all logos
  const prefetchAllLogos = useCallback(async (
    oemLogos: OemType[], 
    updateLogo: (updatedOem: OemType, index: number) => void
  ) => {
    if (prefetchLoading) return;
    
    setPrefetchLoading(true);
    console.log("Starting OEM logo prefetch for", oemLogos.length, "OEMs");
    
    // Process in batches to avoid overwhelming the API
    const processBatch = async (startIndex: number, batchSize: number) => {
      if (startIndex >= oemLogos.length) {
        setPrefetchLoading(false);
        console.log("OEM logo prefetch complete");
        return;
      }
      
      const batch = oemLogos.slice(startIndex, startIndex + batchSize);
      console.log(`Processing OEM logo batch ${startIndex} to ${startIndex + batch.length - 1}`);
      
      try {
        for (let i = 0; i < batch.length; i++) {
          if (!batch[i].logo) {
            const updatedOem = await prefetchLogo(batch[i]);
            updateLogo(updatedOem, startIndex + i);
          }
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
    processBatch(0, 3);
  }, [prefetchLoading, prefetchLogo]);

  return {
    prefetchLoading,
    prefetchLogo,
    prefetchAllLogos
  };
}
