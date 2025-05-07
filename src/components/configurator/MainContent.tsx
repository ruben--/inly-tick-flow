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
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<{ logo_url: string | null, company_name: string | null, website: string | null } | null>(null);

  // Find the FTM and BTM meter types
  const ftmMeter = meterTypes.find(type => type.id === 'ftm');
  const btmMeter = meterTypes.find(type => type.id === 'btm');

  // Check if any assets are selected
  const hasSelectedAssets = selectedAssetTypes.length > 0;

  // Check if any meter types are selected
  const hasSelectedMeterTypes = meterTypes.some(type => type.selected);
  
  // Extract domain from profile website or use default
  const companyDomain = profileData?.website 
    ? new URL(!/^https?:\/\//i.test(profileData.website) ? `https://${profileData.website}` : profileData.website).hostname
    : 'yourcompany.com';
  
  // Fetch user profile data including logo_url and website
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('logo_url, company_name, website')
          .eq('id', user.id)
          .maybeSingle();

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
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white h-full">
        {/* Browser Chrome */}
        <div className="bg-gray-100 p-3 border-b border-gray-200 flex items-center">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 bg-white px-4 py-1 rounded text-xs text-gray-500 text-center">
            {companyDomain}/products
          </div>
        </div>
        
        {/* Browser Content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
          <div className="flex items-center gap-3 mb-6">
            {profileData?.logo_url ? (
              <div className="h-10 w-10 flex items-center justify-center border border-gray-200 rounded overflow-hidden bg-white p-1">
                <img 
                  src={profileData.logo_url} 
                  alt={profileData?.company_name || "Company logo"}
                  className="object-contain w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    // If image fails to load, we'll show company initials instead
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<div class="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
                      <span class="text-lg font-medium">${profileData?.company_name?.slice(0, 2) || 'CO'}</span>
                    </div>`;
                  }}
                />
              </div>
            ) : (
              <CompanyLogo
                website={profileData?.website || selectedCustomer?.website || ''}
                companyName={profileData?.company_name || selectedCustomer?.name || 'Company'}
                className="h-10 w-10"
                logoUrl={null}
              />
            )}
            <h2 className="text-xl font-medium">Products Preview</h2>
          </div>
          
          {/* Hero Section - Updated with new background image */}
          <div className="relative w-full h-[300px] mb-6 rounded-lg overflow-hidden">
            <img 
              src="/lovable-uploads/2c050251-ea30-49f9-b719-a85e8c8c54e4.png" 
              alt="EV Charger with Wood Background" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8">
              <h1 className="font-medium text-white mb-2 text-2xl">
                {isAllCustomersSelected ? 'All customers' : selectedCustomer ? `Welcome ${selectedCustomer.name}` : (
                  <span className="text-[42px]">Choose customers</span>
                )}
              </h1>
              <p className="text-white/90 text-lg">This is your product offering towards customers. </p>
            </div>
          </div>

          {/* Asset Types Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Assets being optimised</CardTitle>
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
              <CardTitle className="text-lg font-medium">Type of optimisation activated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ftmMeter?.selected && <Card className="overflow-hidden">
                    <div className="h-40 bg-muted">
                      <img src="/lovable-uploads/2c050251-ea30-49f9-b719-a85e8c8c54e4.png" alt="Front of the Meter" className="w-full h-full object-cover opacity-70" />
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
                      <img src="/lovable-uploads/2c050251-ea30-49f9-b719-a85e8c8c54e4.png" alt="Behind the Meter" className="w-full h-full object-cover opacity-70" />
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
