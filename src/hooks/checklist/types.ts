
import { CustomerType } from '@/components/configurator/CustomerTypeCard';
import { AssetType } from '@/components/configurator/AssetTypeCard';
import { MeterType } from '@/components/configurator/MeterTypeCard';

export type ConfigData = {
  customerTypes: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    selected: boolean;
  }>;
  assetTypes: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    selected: boolean;
  }>;
  meterTypes: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    selected: boolean;
  }>;
};

export type UseChecklistConfigResult = {
  loading: boolean;
  saving: boolean;
  lastSaved: Date | null;
  customerTypes: CustomerType[];
  assetTypes: AssetType[];
  meterTypes: MeterType[];
  toggleCustomerType: (id: string) => void;
  toggleAssetType: (id: string) => void;
  toggleMeterType: (id: string) => void;
  selectedCustomer: CustomerType | undefined;
  selectedAssetTypes: AssetType[];
  isAllCustomersSelected: boolean;
};
