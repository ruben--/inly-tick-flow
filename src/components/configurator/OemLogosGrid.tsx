
import React from 'react';
import { OemType } from '@/hooks/oem/types';
import { OemLogoCard } from './OemLogoCard';

interface OemLogosGridProps {
  oemLogos: OemType[];
  onToggle: (id: string) => void;
  loading?: boolean;
}

export const OemLogosGrid: React.FC<OemLogosGridProps> = ({ 
  oemLogos, 
  onToggle, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={i} 
            className="h-[140px] animate-pulse bg-muted rounded-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {oemLogos.map((oem) => (
        <OemLogoCard
          key={oem.id}
          id={oem.id}
          name={oem.name}
          domain={oem.domain}
          logo={oem.logo}
          selected={oem.selected}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};
