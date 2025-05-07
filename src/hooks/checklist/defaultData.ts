
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
