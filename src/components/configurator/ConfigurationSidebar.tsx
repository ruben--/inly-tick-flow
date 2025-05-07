
import { useState, useEffect } from 'react';
import { Cog, Users, Zap, BarChart3 } from 'lucide-react';
import { CustomerType } from './CustomerTypeCard';
import { AssetType } from './AssetTypeCard';
import { MeterType } from './MeterTypeCard';
import { ConfigSidebarItem } from './ConfigSidebarItem';

interface ConfigurationSidebarProps {
  customerTypes: CustomerType[];
  assetTypes: AssetType[];
  meterTypes: MeterType[];
  toggleCustomerType: (id: string) => void;
  toggleAssetType: (id: string) => void;
  toggleMeterType: (id: string) => void;
  completedSteps: boolean[];
}

export const ConfigurationSidebar = ({
  customerTypes,
  assetTypes,
  meterTypes,
  toggleCustomerType,
  toggleAssetType,
  toggleMeterType,
  completedSteps
}: ConfigurationSidebarProps) => {
  // Common props for all icons
  const iconProps = { strokeWidth: 1.25 };

  // Calculate progress percentage
  const progressPercentage = Math.round((completedSteps.filter(Boolean).length / completedSteps.length) * 100);

  return (
    <div className="h-full flex flex-col w-full">
      <div className="flex justify-between items-center py-4 border-b-2 border-black px-4 bg-black">
        <h3 className="font-bold text-white text-lg uppercase tracking-wide">Configuration</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <div className="text-black text-xs uppercase tracking-wider font-bold mb-3">Configure Your Offering</div>
          <div className="space-y-4">
            {/* All sections are permanently expanded */}
            <div className="space-y-4">
              <div className="border-none">
                <div className="w-full flex items-center justify-between p-3 rounded-none text-left bg-te-orange border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-black mr-3" {...iconProps} />
                    <span className="text-black font-bold uppercase tracking-wider text-xs">Customer Types</span>
                  </div>
                </div>
                <div className="pt-3 pb-0">
                  <div className="ml-3 space-y-3 bg-white p-3 rounded-none border-2 border-black">
                    {customerTypes.map(type => (
                      <ConfigSidebarItem
                        key={type.id}
                        itemType={type}
                        onToggle={() => toggleCustomerType(type.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border-none">
                <div className="w-full flex items-center justify-between p-3 rounded-none text-left bg-te-orange border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 text-black mr-3" {...iconProps} />
                    <span className="text-black font-bold uppercase tracking-wider text-xs">Asset Types</span>
                  </div>
                </div>
                <div className="pt-3 pb-0">
                  <div className="ml-3 space-y-3 bg-white p-3 rounded-none border-2 border-black">
                    {assetTypes.map(type => (
                      <ConfigSidebarItem
                        key={type.id}
                        itemType={type}
                        onToggle={() => toggleAssetType(type.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border-none">
                <div className="w-full flex items-center justify-between p-3 rounded-none text-left bg-te-orange border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-black mr-3" {...iconProps} />
                    <span className="text-black font-bold uppercase tracking-wider text-xs">Optimization</span>
                  </div>
                </div>
                <div className="pt-3 pb-0">
                  <div className="ml-3 space-y-3 bg-white p-3 rounded-none border-2 border-black">
                    {meterTypes.map(type => (
                      <ConfigSidebarItem
                        key={type.id}
                        itemType={type}
                        onToggle={() => toggleMeterType(type.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t-2 border-black bg-white">
        <div className="text-xs text-black uppercase tracking-wider font-bold mb-2">Progress</div>
        <div className="w-full bg-te-gray-200 h-2 rounded-none overflow-hidden border border-black">
          <div 
            className="bg-te-orange h-full rounded-none transition-all duration-500 ease-in-out"
            style={{
              width: `${progressPercentage}%`
            }}
          ></div>
        </div>
        <div className="text-xs text-black mt-2 text-right font-mono">
          {completedSteps.filter(Boolean).length} of {completedSteps.length} complete
        </div>
      </div>
    </div>
  );
};
