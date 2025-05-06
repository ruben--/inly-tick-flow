import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerType } from './CustomerTypeCard';
import { AssetType } from './AssetTypeCard';
import { MeterType } from './MeterTypeCard';
interface MainContentProps {
  selectedCustomer: CustomerType | undefined;
  selectedAssetTypes: AssetType[];
  isAllCustomersSelected: boolean;
  meterTypes: MeterType[];
}
export const MainContent = ({
  selectedCustomer,
  selectedAssetTypes,
  isAllCustomersSelected,
  meterTypes
}: MainContentProps) => {
  // Find the FTM and BTM meter types
  const ftmMeter = meterTypes.find(type => type.id === 'ftm');
  const btmMeter = meterTypes.find(type => type.id === 'btm');

  // Check if any assets are selected
  const hasSelectedAssets = selectedAssetTypes.length > 0;

  // Check if any meter types are selected
  const hasSelectedMeterTypes = meterTypes.some(type => type.selected);
  return <div className="md:w-2/3 lg:w-3/4">
      {/* Browser Mockup */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white">
        {/* Browser Chrome */}
        <div className="bg-gray-100 p-3 border-b border-gray-200 flex items-center">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 bg-white px-4 py-1 rounded text-xs text-gray-500 text-center">
            yourcompany.com/products
          </div>
        </div>
        
        {/* Browser Content */}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-6">Products Preview</h2>
          
          {/* Hero Section */}
          <div className="relative w-full h-[300px] mb-6 rounded-lg overflow-hidden">
            <img src={selectedCustomer?.image || '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png'} alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                {isAllCustomersSelected ? 'All customers' : selectedCustomer ? `Welcome ${selectedCustomer.name}` : 'Choose customers'}
              </h1>
              <p className="text-white/90 text-lg">This is your product offering towards customers. </p>
            </div>
          </div>

          {/* Asset Types Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-normal">Assets being optimised</CardTitle>
            </CardHeader>
            <CardContent>
              {hasSelectedAssets ? <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedAssetTypes.map(type => <Card key={type.id} className="flex overflow-hidden">
                      <div className="w-20 shrink-0">
                        <img src={type.image} alt={type.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">{type.name}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </Card>)}
                </div> : <div className="text-center py-8">
                  <p className="text-muted-foreground">No assets are being optimised</p>
                </div>}
            </CardContent>
          </Card>

          {/* Savings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-normal">Type of optimisation activated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ftmMeter?.selected && <Card className="overflow-hidden">
                    <div className="h-40 bg-muted">
                      <img src="/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png" alt="Front of the Meter" className="w-full h-full object-cover opacity-50" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">Front of the Meter</h3>
                      <p className="text-sm text-muted-foreground">
                        {ftmMeter.description}
                      </p>
                    </CardContent>
                  </Card>}
                
                {btmMeter?.selected && <Card className="overflow-hidden">
                    <div className="h-40 bg-muted">
                      <img src="/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png" alt="Behind the Meter" className="w-full h-full object-cover opacity-50" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">Behind the Meter</h3>
                      <p className="text-sm text-muted-foreground">
                        {btmMeter.description}
                      </p>
                    </CardContent>
                  </Card>}

                {/* Show message when no meter types are selected */}
                {!hasSelectedMeterTypes && <div className="col-span-2 text-center py-8">
                    <p className="text-muted-foreground">No optimisation is activated</p>
                  </div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};