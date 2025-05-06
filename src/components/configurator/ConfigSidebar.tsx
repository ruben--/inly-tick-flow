
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerTypeCard, CustomerType } from './CustomerTypeCard';
import { AssetTypeCard, AssetType } from './AssetTypeCard';
import { MeterTypeCard, MeterType } from './MeterTypeCard';

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
  return (
    <div className="md:w-1/3 lg:w-1/4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Design your offering</CardTitle>
          <CardDescription>
            Choose your target customers and add products, assets, and more that suit your business needs.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Target Customers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Target customers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {customerTypes.map((type) => (
            <CustomerTypeCard 
              key={type.id} 
              customerType={type} 
              onToggle={toggleCustomerType} 
            />
          ))}
        </CardContent>
      </Card>

      {/* Asset Types */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Asset types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assetTypes.map((type) => (
            <AssetTypeCard 
              key={type.id} 
              assetType={type} 
              onToggle={toggleAssetType} 
            />
          ))}
        </CardContent>
      </Card>

      {/* FTM & BTM */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">FTM & BTM</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {meterTypes.map((type) => (
            <MeterTypeCard 
              key={type.id} 
              meterType={type} 
              onToggle={toggleMeterType} 
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
