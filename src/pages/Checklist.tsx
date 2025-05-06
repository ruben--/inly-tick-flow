
import { useState } from 'react';
import { ConfigSidebar } from '@/components/configurator/ConfigSidebar';
import { MainContent } from '@/components/configurator/MainContent';
import { CustomerType } from '@/components/configurator/CustomerTypeCard';
import { AssetType } from '@/components/configurator/AssetTypeCard';
import { MeterType } from '@/components/configurator/MeterTypeCard';

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

  const [meterTypes, setMeterTypes] = useState<MeterType[]>([
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
  const selectedAssetTypes = assetTypes.filter(type => type.selected);
  const isAllCustomersSelected = customerTypes.every(type => type.selected);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      <ConfigSidebar 
        customerTypes={customerTypes}
        assetTypes={assetTypes}
        meterTypes={meterTypes}
        toggleCustomerType={toggleCustomerType}
        toggleAssetType={toggleAssetType}
        toggleMeterType={toggleMeterType}
      />
      <MainContent 
        selectedCustomer={selectedCustomer}
        selectedAssetTypes={selectedAssetTypes}
        isAllCustomersSelected={isAllCustomersSelected}
        meterTypes={meterTypes}
      />
    </div>
  );
};

export default Checklist;
