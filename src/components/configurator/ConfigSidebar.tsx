
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerTypeCard, CustomerType } from './CustomerTypeCard';
import { AssetTypeCard, AssetType } from './AssetTypeCard';
import { MeterTypeCard, MeterType } from './MeterTypeCard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Users, Zap, BarChart3 } from 'lucide-react';

interface ConfigSidebarProps {
  customerTypes: CustomerType[];
  assetTypes: AssetType[];
  meterTypes: MeterType[];
  toggleCustomerType: (id: string) => void;
  toggleAssetType: (id: string) => void;
  toggleMeterType: (id: string) => void;
}

export const ConfigSidebar = ({
  customerTypes,
  assetTypes,
  meterTypes,
  toggleCustomerType,
  toggleAssetType,
  toggleMeterType
}: ConfigSidebarProps) => {
  // Create state for each collapsible section
  const [customersOpen, setCustomersOpen] = useState(true);
  const [assetsOpen, setAssetsOpen] = useState(true);
  const [metersOpen, setMetersOpen] = useState(true);
  
  return (
    <div className="md:w-1/3 lg:w-1/4 space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Configure Your Offering</CardTitle>
          <CardDescription>Customise what products and services you'd like to offer to your customers.</CardDescription>
        </CardHeader>
      </Card>

      {/* Target Customers */}
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg text-gray-800">Customer Type settings</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-800 hover:bg-gray-100" onClick={() => setCustomersOpen(!customersOpen)}>
              {customersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <Collapsible open={customersOpen} onOpenChange={setCustomersOpen}>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              {customerTypes.map(type => <CustomerTypeCard key={type.id} customerType={type} onToggle={toggleCustomerType} />)}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Asset Types */}
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg text-gray-800">Asset settings</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-800 hover:bg-gray-100" onClick={() => setAssetsOpen(!assetsOpen)}>
              {assetsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <Collapsible open={assetsOpen} onOpenChange={setAssetsOpen}>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              {assetTypes.map(type => <AssetTypeCard key={type.id} assetType={type} onToggle={toggleAssetType} />)}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* FTM & BTM */}
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg text-gray-800">Optimisation settings</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-800 hover:bg-gray-100" onClick={() => setMetersOpen(!metersOpen)}>
              {metersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <Collapsible open={metersOpen} onOpenChange={setMetersOpen}>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              {meterTypes.map(type => <MeterTypeCard key={type.id} meterType={type} onToggle={toggleMeterType} />)}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};
