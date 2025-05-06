
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerType } from './CustomerTypeCard';
import { AssetType } from './AssetTypeCard';

interface MainContentProps {
  selectedCustomer: CustomerType | undefined;
  selectedAssetTypes: AssetType[];
}

export const MainContent = ({ selectedCustomer, selectedAssetTypes }: MainContentProps) => {
  return (
    <div className="md:w-2/3 lg:w-3/4">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] mb-6 rounded-lg overflow-hidden">
        <img 
          src={selectedCustomer?.image || '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png'} 
          alt="Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome {selectedCustomer?.name || 'Customers'}
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
  );
};
