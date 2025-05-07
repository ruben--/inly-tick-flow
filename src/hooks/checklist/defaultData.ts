
import { CustomerType } from '@/components/configurator/CustomerTypeCard';
import { AssetType } from '@/components/configurator/AssetTypeCard';
import { MeterType } from '@/components/configurator/MeterTypeCard';

export const defaultCustomerTypes: CustomerType[] = [
  {
    id: 'commercial',
    name: 'Commerce & Industry',
    description: 'Such as data centers, solar parks, wind farms.',
    image: '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png',
    selected: false,
    website: 'https://commercial-industry.com',
  },
  {
    id: 'residential',
    name: 'Residential',
    description: 'Such as data centers, solar parks, wind farms.',
    image: '/lovable-uploads/388cb3ae-5232-42dd-a7f2-c79ef33ba59d.png',
    selected: true,
    website: 'https://residential-energy.com',
  },
];

export const defaultAssetTypes: AssetType[] = [
  {
    id: 'bess',
    name: 'BESS',
    description: 'Such as data centres, solar parks, wind farms.',
    image: '/lovable-uploads/6fa399e2-0010-4f79-a4f1-c7017f756e8e.png',
    selected: true,
  },
  {
    id: 'ev',
    name: 'EV',
    description: 'Such as data centres, solar parks, wind farms.',
    image: '/lovable-uploads/2d53f933-1dd1-42c5-8b78-c70e136a2d06.png',
    selected: true,
  },
  {
    id: 'pv',
    name: 'PV',
    description: 'Such as data centres, solar parks, wind farms.',
    image: '/lovable-uploads/95416fbe-e0e2-427e-8897-2d64dd54b623.png',
    selected: false,
  },
];

export const defaultMeterTypes: MeterType[] = [
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
];
