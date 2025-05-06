
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
  const [activeSection, setActiveSection] = useState<string | null>("customers");
  
  const handleSectionClick = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarRail />
        <SidebarHeader className="flex justify-between items-center py-4">
          <h3 className="font-medium text-sidebar-foreground text-sm px-4">Configuration</h3>
          <SidebarTrigger className="mr-2" />
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Configure Your Offering</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeSection === "customers"}
                    onClick={() => handleSectionClick("customers")}
                    tooltip="Customer Types"
                  >
                    <Users className="h-5 w-5" />
                    <span>Customer Types</span>
                    <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${
                      activeSection === "customers" ? "rotate-90" : ""
                    }`} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                {activeSection === "customers" && (
                  <div className="ml-4 mt-2 space-y-3">
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
                  >
                    <Zap className="h-5 w-5" />
                    <span>Asset Types</span>
                    <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${
                      activeSection === "assets" ? "rotate-90" : ""
                    }`} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                {activeSection === "assets" && (
                  <div className="ml-4 mt-2 space-y-3">
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
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>Optimization</span>
                    <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${
                      activeSection === "meters" ? "rotate-90" : ""
                    }`} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                {activeSection === "meters" && (
                  <div className="ml-4 mt-2 space-y-3">
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
        
        <SidebarFooter className="pb-4">
          <div className="px-3">
            <div className="text-xs text-sidebar-foreground/70 mb-2">Configuration Progress</div>
            <div className="w-full bg-sidebar-accent h-1 rounded-full overflow-hidden">
              <div 
                className="bg-sidebar-primary h-full rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width: `${completedSteps.filter(Boolean).length / completedSteps.length * 100}%`
                }}
              ></div>
            </div>
            <div className="text-xs text-sidebar-foreground/70 mt-2 text-right">
              {completedSteps.filter(Boolean).length} of {completedSteps.length} complete
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};
