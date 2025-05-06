
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerType } from './CustomerTypeCard';
import { AssetType } from './AssetTypeCard';

interface MainContentProps {
  selectedCustomer: CustomerType | undefined;
  selectedAssetTypes: AssetType[];
  isAllCustomersSelected: boolean;
}

export const MainContent = ({ selectedCustomer, selectedAssetTypes, isAllCustomersSelected }: MainContentProps) => {
  return (
    <div className="md:w-2/3 lg:w-3/4">
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
            <img 
              src={selectedCustomer?.image || '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png'} 
              alt="Hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                {isAllCustomersSelected 
                  ? 'All customers' 
                  : selectedCustomer 
                    ? `Welcome ${selectedCustomer.name}` 
                    : 'Choose customers'}
              </h1>
              <p className="text-white/90 text-lg">
                We got you covered, whatever your needs
              </p>
            </div>
          </div>

          {/* Asset Types Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Headline about supporting different asset types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedAssetTypes.map((type) => (
                  <Card key={type.id} className="flex overflow-hidden">
                    <div className="w-20 shrink-0">
                      <img 
                        src={type.image} 
                        alt={type.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{type.name}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Savings Section */}
          <Card>
            <CardHeader>
              <CardTitle>Headline about saving and earning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                  <div className="h-40 bg-muted">
                    <img 
                      src="/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png"
                      alt="Savings visual" 
                      className="w-full h-full object-cover opacity-50"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">Headline headline</h3>
                    <p className="text-sm text-muted-foreground">
                      Such as data centres, solar parks, wind farms. As data centres, solar parks, farms.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="h-40 bg-muted">
                    <img 
                      src="/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png"
                      alt="Earnings visual" 
                      className="w-full h-full object-cover opacity-50"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">Headline headline</h3>
                    <p className="text-sm text-muted-foreground">
                      Such as data centres, solar parks, wind farms. As data centres, solar parks, farms.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
