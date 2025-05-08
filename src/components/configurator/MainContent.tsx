
import { useAuth } from '@/contexts/AuthContext';
import { CustomerType } from './CustomerTypeCard';
import { AssetType } from './AssetTypeCard';
import { MeterType } from './MeterTypeCard';
import { BrowserChrome } from './preview/BrowserChrome';
import { PreviewHeader } from './preview/PreviewHeader';
import { HeroSection } from './preview/HeroSection';
import { AssetSection } from './preview/AssetSection';
import { OptimizationSection } from './preview/OptimizationSection';
import { useProfileData } from './preview/useProfileData';

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
  const { user } = useAuth();
  const { profileData, companyDomain } = useProfileData(user?.id);

  return (
    <div className="w-full h-full flex flex-col">
      <BrowserChrome companyDomain={companyDomain}>
        <div className="flex flex-col space-y-6">
          <PreviewHeader 
            companyName={profileData?.company_name}
            website={profileData?.website || selectedCustomer?.website}
          />
          
          <HeroSection 
            selectedCustomer={selectedCustomer}
            isAllCustomersSelected={isAllCustomersSelected}
          />
          
          <AssetSection selectedAssetTypes={selectedAssetTypes} />
          
          <OptimizationSection meterTypes={meterTypes} />
        </div>
      </BrowserChrome>
    </div>
  );
};
