import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerType } from './CustomerTypeCard';
import { AssetType } from './AssetTypeCard';
import { MeterType } from './MeterTypeCard';
import { CompanyLogo } from '@/components/profile/CompanyLogo';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  const {
    user
  } = useAuth();
  const [profileData, setProfileData] = useState<{
    logo_url: string | null;
    company_name: string | null;
    website: string | null;
  } | null>(null);

  // Find the FTM and BTM meter types
  const ftmMeter = meterTypes.find(type => type.id === 'ftm');
  const btmMeter = meterTypes.find(type => type.id === 'btm');

  // Check if any assets are selected
  const hasSelectedAssets = selectedAssetTypes.length > 0;

  // Check if any meter types are selected
  const hasSelectedMeterTypes = meterTypes.some(type => type.selected);

  // Extract domain from profile website or use default
  const companyDomain = profileData?.website ? new URL(!/^https?:\/\//i.test(profileData.website) ? `https://${profileData.website}` : profileData.website).hostname : 'yourcompany.com';

  // Fetch user profile data including logo_url and website
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      try {
        const {
          data,
          error
        } = await supabase.from('profiles').select('logo_url, company_name, website').eq('id', user.id).maybeSingle();
        if (error) {
          console.error("Error fetching profile data:", error);
          return;
        }
        setProfileData(data);
      } catch (err) {
        console.error("Error in profile fetch:", err);
      }
    };
    fetchProfileData();
  }, [user]);
  return <div className="w-full flex-grow p-0">
      {/* Browser Mockup */}
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white h-full">
        {/* Browser Chrome */}
        <div className="bg-gray-100 p-3 border-b border-gray-200 flex items-center">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 bg-white px-4 py-1 rounded text-xs text-gray-600 text-center font-medium sidebar-browser-domain border border-gray-200">
            {companyDomain}/products
          </div>
        </div>
        
        {/* Browser Content */}
        <div className="p-4 overflow-y-auto" style={{
        maxHeight: "calc(100vh - 180px)"
      }}>
          <div className="flex items-center gap-3 mb-6 bg-gray-50 p-3 rounded-md">
            {profileData?.logo_url ? <div className="h-10 w-10 flex items-center justify-center border border-gray-200 rounded-full overflow-hidden bg-white p-1">
                <img src={profileData.logo_url} alt={profileData?.company_name || "Company logo"} className="object-contain w-full h-full" onError={e => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              // If image fails to load, we'll show company initials instead
              target.style.display = 'none';
              target.parentElement!.innerHTML = `<div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
                      <span className="text-lg font-medium sidebar-company-name">${profileData?.company_name?.slice(0, 2) || 'CO'}</span>
                    </div>`;
            }} />
              </div> : <CompanyLogo website={profileData?.website || selectedCustomer?.website || ''} companyName={profileData?.company_name || selectedCustomer?.name || 'Company'} className="h-10 w-10" logoUrl={null} />}
            <h2 className="text-xl font-medium text-gray-800 sidebar-heading-content">Products Preview</h2>
          </div>
          
          {/* Hero Section - Updated with neutral background image */}
          <div className="relative w-full h-[300px] mb-6 rounded-lg overflow-hidden shadow-md">
            <img src="/lovable-uploads/2c050251-ea30-49f9-b719-a85e8c8c54e4.png" alt="EV Charger with Wood Background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800/70 to-gray-600/20 flex flex-col justify-center p-8">
              <h1 className="font-medium text-white mb-2 text-2xl shadow-sm">
                {isAllCustomersSelected ? 'All customers' : selectedCustomer ? `Welcome ${selectedCustomer.name}` : <span className="text-[42px]">Choose customers</span>}
              </h1>
              <p className="text-white/90 text-lg backdrop-blur-sm bg-gray-900/30 p-2 rounded-md inline-block sidebar-collapse-text">
                This is your product offering towards customers. 
              </p>
            </div>
          </div>

          {/* Asset Types Section */}
          <Card className="mb-6 border-gray-300 shadow-md">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-lg font-medium text-gray-800">Assets being optimised</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {hasSelectedAssets ? <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedAssetTypes.map(type => <Card key={type.id} className="flex overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-all">
                      <div className="w-20 shrink-0 bg-gray-50">
                        <img src={type.image} alt={type.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-700">{type.name}</h3>
                        <p className="text-sm text-gray-600 sidebar-collapse-text">{type.description}</p>
                      </div>
                    </Card>)}
                </div> : <div className="text-center py-8">
                  <p className="text-gray-500 sidebar-collapse-text">No assets are being optimised</p>
                </div>}
            </CardContent>
          </Card>

          {/* Savings Section */}
          <Card className="border-gray-300 shadow-md">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-lg font-medium text-gray-800">Type of optimisation activated</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ftmMeter?.selected && <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <div className="h-40 bg-gray-50 relative">
                      <img src="/lovable-uploads/2c050251-ea30-49f9-b719-a85e8c8c54e4.png" alt="Front of the Meter" className="w-full h-full object-cover opacity-100" />
                      <div className="absolute top-2 right-2 bg-gray-600 text-white px-2 py-1 rounded-md text-xs">Active</div>
                    </div>
                    <CardContent className="p-4 bg-gradient-to-b from-white to-gray-50">
                      <h3 className="font-medium text-gray-800">Front of the Meter</h3>
                      <p className="text-sm text-gray-600 sidebar-collapse-text">
                        {ftmMeter.description}
                      </p>
                    </CardContent>
                  </Card>}
                
                {btmMeter?.selected && <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <div className="h-40 bg-gray-50 relative">
                      <img alt="Behind the Meter" className="w-full h-full object-cover opacity-100" src="/lovable-uploads/92486d5d-2202-48c8-ab14-f8f1a4c3c7ba.png" />
                      <div className="absolute top-2 right-2 bg-gray-600 text-white px-2 py-1 rounded-md text-xs">Active</div>
                    </div>
                    <CardContent className="p-4 bg-gradient-to-b from-white to-gray-50">
                      <h3 className="font-medium text-gray-800">Behind the Meter</h3>
                      <p className="text-sm text-gray-600 sidebar-collapse-text">
                        {btmMeter.description}
                      </p>
                    </CardContent>
                  </Card>}

                {/* Show message when no meter types are selected */}
                {!hasSelectedMeterTypes && <div className="col-span-2 text-center py-8">
                    <p className="text-gray-500 sidebar-collapse-text">No optimisation is activated</p>
                  </div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};