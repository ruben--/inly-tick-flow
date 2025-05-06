
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerTypeCard, CustomerType } from './CustomerTypeCard';
import { AssetTypeCard, AssetType } from './AssetTypeCard';
import { MeterTypeCard, MeterType } from './MeterTypeCard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  toggleMeterType,
}: ConfigSidebarProps) => {
  // Create state for each collapsible section
  const [customersOpen, setCustomersOpen] = useState(true);
  const [assetsOpen, setAssetsOpen] = useState(true);
  const [metersOpen, setMetersOpen] = useState(true);

  return (
    <div className="md:w-1/3 lg:w-1/4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configure Your Offering</CardTitle>
          <CardDescription>
            Customize what products and services you'd like to offer to your customers.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Target Customers */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Target customers</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setCustomersOpen(!customersOpen)}
            >
              {customersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <Collapsible open={customersOpen} onOpenChange={setCustomersOpen}>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {customerTypes.map((type) => (
                <CustomerTypeCard 
                  key={type.id} 
                  customerType={type} 
                  onToggle={toggleCustomerType} 
                />
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Asset Types */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Asset types</CardTitle>
            <Button
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setAssetsOpen(!assetsOpen)}
            >
              {assetsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <Collapsible open={assetsOpen} onOpenChange={setAssetsOpen}>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {assetTypes.map((type) => (
                <AssetTypeCard 
                  key={type.id} 
                  assetType={type} 
                  onToggle={toggleAssetType} 
                />
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* FTM & BTM */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">FTM & BTM</CardTitle>
            <Button
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setMetersOpen(!metersOpen)}
            >
              {metersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <Collapsible open={metersOpen} onOpenChange={setMetersOpen}>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {meterTypes.map((type) => (
                <MeterTypeCard 
                  key={type.id} 
                  meterType={type} 
                  onToggle={toggleMeterType} 
                />
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};
