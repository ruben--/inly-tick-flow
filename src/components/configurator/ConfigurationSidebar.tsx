
import { useState } from 'react';
import { Cog, Users, Zap, BarChart3, ChevronRight } from 'lucide-react';
import { CustomerType } from './CustomerTypeCard';
import { AssetType } from './AssetTypeCard';
import { MeterType } from './MeterTypeCard';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarTrigger,
  SidebarRail
} from '@/components/ui/sidebar';
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
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarRail />
        <SidebarHeader className="flex justify-between items-center py-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 text-sm px-4 sidebar-collapse-text">Configuration</h3>
          <SidebarTrigger className="mr-2 text-gray-600 hover:bg-gray-100" />
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-700">Configure Your Offering</SidebarGroupLabel>
            <SidebarGroupContent className="overflow-hidden">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeSection === "customers"}
                    onClick={() => handleSectionClick("customers")}
                    tooltip="Customer Types"
                    className={activeSection === "customers" ? "bg-gray-100" : ""}
                  >
                    <Users className="h-5 w-5 text-gray-600" {...iconProps} />
                    <span className="truncate text-gray-800">Customer Types</span>
                    <ChevronRight className={`ml-auto h-4 w-4 shrink-0 transition-transform text-gray-500 ${
                      activeSection === "customers" ? "rotate-90" : ""
                    }`} {...iconProps} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
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
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeSection === "assets"}
                    onClick={() => handleSectionClick("assets")}
                    tooltip="Asset Types"
                    className={activeSection === "assets" ? "bg-gray-100" : ""}
                  >
                    <Zap className="h-5 w-5 text-gray-600" {...iconProps} />
                    <span className="truncate text-gray-800">Asset Types</span>
                    <ChevronRight className={`ml-auto h-4 w-4 shrink-0 transition-transform text-gray-500 ${
                      activeSection === "assets" ? "rotate-90" : ""
                    }`} {...iconProps} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
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
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeSection === "meters"}
                    onClick={() => handleSectionClick("meters")}
                    tooltip="Optimization Types"
                    className={activeSection === "meters" ? "bg-gray-100" : ""}
                  >
                    <BarChart3 className="h-5 w-5 text-gray-600" {...iconProps} />
                    <span className="truncate text-gray-800">Optimization</span>
                    <ChevronRight className={`ml-auto h-4 w-4 shrink-0 transition-transform text-gray-500 ${
                      activeSection === "meters" ? "rotate-90" : ""
                    }`} {...iconProps} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
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
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="pb-4 border-t border-gray-200 pt-3">
          <div className="px-3">
            <div className="text-xs text-gray-700 mb-2 font-medium sidebar-footer-text">Configuration Progress</div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gray-600 h-full rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width: `${progressPercentage}%`
                }}
              ></div>
            </div>
            <div className="text-xs text-gray-700 mt-2 text-right sidebar-footer-text">
              {completedSteps.filter(Boolean).length} of {completedSteps.length} complete
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};
