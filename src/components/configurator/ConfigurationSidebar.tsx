
import { useState } from 'react';
import { Cog, Users, Zap, BarChart3, ChevronRight } from 'lucide-react';
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
  // Initialize all sections as expanded by default
  const [activeSection, setActiveSection] = useState<string | null>("customers");
  
  const handleSectionClick = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Common props for all icons
  const iconProps = { strokeWidth: 1.5 };

  // Calculate progress percentage
  const progressPercentage = Math.round((completedSteps.filter(Boolean).length / completedSteps.length) * 100);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex justify-between items-center py-4 border-b border-gray-200 px-4">
        <h3 className="font-medium text-gray-800 text-sm">Configuration</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="mb-4">
          <div className="text-gray-700 text-sm font-medium mb-2">Configure Your Offering</div>
          <div className="space-y-1">
            <button 
              onClick={() => handleSectionClick("customers")}
              className={`w-full flex items-center justify-between p-2 rounded-md text-left ${
                activeSection === "customers" ? "bg-gray-100" : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-600 mr-2" {...iconProps} />
                <span className="text-gray-800">Customer Types</span>
              </div>
              <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform ${
                activeSection === "customers" ? "rotate-90" : ""
              }`} {...iconProps} />
            </button>
            
            {activeSection === "customers" && (
              <div className="ml-4 mt-2 space-y-3 bg-gray-50 p-2 rounded-md">
                {customerTypes.map(type => (
                  <ConfigSidebarItem
                    key={type.id}
                    itemType={type}
                    onToggle={() => toggleCustomerType(type.id)}
                  />
                ))}
              </div>
            )}
            
            <button 
              onClick={() => handleSectionClick("assets")}
              className={`w-full flex items-center justify-between p-2 rounded-md text-left ${
                activeSection === "assets" ? "bg-gray-100" : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-gray-600 mr-2" {...iconProps} />
                <span className="text-gray-800">Asset Types</span>
              </div>
              <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform ${
                activeSection === "assets" ? "rotate-90" : ""
              }`} {...iconProps} />
            </button>
            
            {activeSection === "assets" && (
              <div className="ml-4 mt-2 space-y-3 bg-gray-50 p-2 rounded-md">
                {assetTypes.map(type => (
                  <ConfigSidebarItem
                    key={type.id}
                    itemType={type}
                    onToggle={() => toggleAssetType(type.id)}
                  />
                ))}
              </div>
            )}
            
            <button 
              onClick={() => handleSectionClick("meters")}
              className={`w-full flex items-center justify-between p-2 rounded-md text-left ${
                activeSection === "meters" ? "bg-gray-100" : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-gray-600 mr-2" {...iconProps} />
                <span className="text-gray-800">Optimization</span>
              </div>
              <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform ${
                activeSection === "meters" ? "rotate-90" : ""
              }`} {...iconProps} />
            </button>
            
            {activeSection === "meters" && (
              <div className="ml-4 mt-2 space-y-3 bg-gray-50 p-2 rounded-md">
                {meterTypes.map(type => (
                  <ConfigSidebarItem
                    key={type.id}
                    itemType={type}
                    onToggle={() => toggleMeterType(type.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-200">
        <div className="text-xs text-gray-700 mb-2 font-medium">Configuration Progress</div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gray-600 h-full rounded-full transition-all duration-500 ease-in-out"
            style={{
              width: `${progressPercentage}%`
            }}
          ></div>
        </div>
        <div className="text-xs text-gray-700 mt-2 text-right">
          {completedSteps.filter(Boolean).length} of {completedSteps.length} complete
        </div>
      </div>
    </div>
  );
};
