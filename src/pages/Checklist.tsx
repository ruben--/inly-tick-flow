
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CustomerType {
  id: string;
  name: string;
  description: string;
  image: string;
  selected: boolean;
}

interface AssetType {
  id: string;
  name: string;
  description: string;
  image: string;
  selected: boolean;
}

const Checklist = () => {
  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>([
    {
      id: 'commercial',
      name: 'Commerce & Industry',
      description: 'Such as data centers, solar parks, wind farms.',
      image: '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png',
      selected: false,
    },
    {
      id: 'residential',
      name: 'Residential',
      description: 'Such as data centers, solar parks, wind farms.',
      image: '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png',
      selected: true,
    },
  ]);

  const [assetTypes, setAssetTypes] = useState<AssetType[]>([
    {
      id: 'bess',
      name: 'BESS',
      description: 'Such as data centres, solar parks, wind farms.',
      image: '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png',
      selected: true,
    },
    {
      id: 'ev',
      name: 'EV',
      description: 'Such as data centres, solar parks, wind farms.',
      image: '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png',
      selected: true,
    },
    {
      id: 'pv',
      name: 'PV',
      description: 'Such as data centres, solar parks, wind farms.',
      image: '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png',
      selected: false,
    },
  ]);

  const [meterTypes, setMeterTypes] = useState([
    {
      id: 'ftm',
      name: 'Front of the Meter',
      description: 'Grid-connected installations',
      image: '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png',
      selected: false,
    },
    {
      id: 'btm',
      name: 'Behind the Meter',
      description: 'Customer-side installations',
      image: '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png',
      selected: false,
    },
  ]);

  const toggleCustomerType = (id: string) => {
    setCustomerTypes(prevTypes => 
      prevTypes.map(type => ({
        ...type,
        selected: type.id === id ? !type.selected : type.selected
      }))
    );
  };

  const toggleAssetType = (id: string) => {
    setAssetTypes(prevTypes => 
      prevTypes.map(type => ({
        ...type,
        selected: type.id === id ? !type.selected : type.selected
      }))
    );
  };

  const toggleMeterType = (id: string) => {
    setMeterTypes(prevTypes => 
      prevTypes.map(type => ({
        ...type,
        selected: type.id === id ? !type.selected : type.selected
      }))
    );
  };

  const selectedCustomer = customerTypes.find(type => type.selected);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left sidebar with options */}
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
              <div 
                key={type.id}
                className={`flex gap-3 p-3 rounded-md cursor-pointer border transition-all ${
                  type.selected ? 'border-primary bg-muted/30' : 'border-border'
                }`}
                onClick={() => toggleCustomerType(type.id)}
              >
                <div className="w-16 h-16 overflow-hidden rounded-md shrink-0">
                  <img 
                    src={type.image} 
                    alt={type.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{type.name}</h3>
                    <Checkbox checked={type.selected} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                </div>
              </div>
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
              <div
                key={type.id}
                className={`flex gap-3 p-3 rounded-md cursor-pointer border transition-all ${
                  type.selected ? 'border-primary bg-muted/30' : 'border-border'
                }`}
                onClick={() => toggleAssetType(type.id)}
              >
                <div className="w-16 h-16 overflow-hidden rounded-md shrink-0">
                  <img 
                    src={type.image} 
                    alt={type.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{type.name}</h3>
                    <Checkbox checked={type.selected} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                </div>
              </div>
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
              <div
                key={type.id}
                className={`flex gap-3 p-3 rounded-md cursor-pointer border transition-all ${
                  type.selected ? 'border-primary bg-muted/30' : 'border-border'
                }`}
                onClick={() => toggleMeterType(type.id)}
              >
                <div className="w-16 h-16 overflow-hidden rounded-md shrink-0">
                  <img 
                    src={type.image} 
                    alt={type.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{type.name}</h3>
                    <Checkbox checked={type.selected} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
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
              {assetTypes.filter(type => type.selected).map((type) => (
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
  );
};

export default Checklist;
