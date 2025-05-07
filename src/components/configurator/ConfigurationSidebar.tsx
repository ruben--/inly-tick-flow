
import { Users, Zap, BarChart3 } from 'lucide-react';
import { CustomerType } from './CustomerTypeCard';
import { AssetType } from './AssetTypeCard';
import { MeterType } from './MeterTypeCard';
import { ConfigSidebarItem } from './ConfigSidebarItem';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarProgressFooter } from './sidebar/SidebarProgressFooter';
import { ConfigSection } from './sidebar/ConfigSection';

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
  const completedCount = completedSteps.filter(Boolean).length;
  const totalCount = completedSteps.length;

  return (
    <div className="h-full flex flex-col w-full relative">
      {/* Inner shadow overlay on the right edge */}
      <div className="absolute top-0 right-0 bottom-0 w-2 pointer-events-none" style={{
        background: 'linear-gradient(to left, rgba(0,0,0,0.15), rgba(0,0,0,0))'
      }}></div>
      
      <SidebarHeader title="Configuration" />
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <div className="text-black text-xs uppercase tracking-wider font-bold mb-3">Configure Your Offering</div>
          <div className="space-y-4">
            {/* All sections are permanently expanded */}
            <div className="space-y-4">
              <ConfigSection 
                title="Customer Types" 
                icon={<Users className="h-5 w-5 text-black mr-3" {...iconProps} />}
              >
                {customerTypes.map(type => (
                  <ConfigSidebarItem
                    key={type.id}
                    itemType={type}
                    onToggle={() => toggleCustomerType(type.id)}
                  />
                ))}
              </ConfigSection>
              
              <ConfigSection 
                title="Asset Types" 
                icon={<Zap className="h-5 w-5 text-black mr-3" {...iconProps} />}
              >
                {assetTypes.map(type => (
                  <ConfigSidebarItem
                    key={type.id}
                    itemType={type}
                    onToggle={() => toggleAssetType(type.id)}
                  />
                ))}
              </ConfigSection>
              
              <ConfigSection 
                title="Optimization" 
                icon={<BarChart3 className="h-5 w-5 text-black mr-3" {...iconProps} />}
              >
                {meterTypes.map(type => (
                  <ConfigSidebarItem
                    key={type.id}
                    itemType={type}
                    onToggle={() => toggleMeterType(type.id)}
                  />
                ))}
              </ConfigSection>
            </div>
          </div>
        </div>
      </div>
      
      <SidebarProgressFooter 
        progressPercentage={progressPercentage}
        completedCount={completedCount}
        totalCount={totalCount}
      />
    </div>
  );
};
