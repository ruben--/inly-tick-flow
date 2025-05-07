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
      {/* TE-style Browser Mockup */}
      <div className="border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden bg-white h-full rounded-none">
        {/* TE-style Browser Chrome */}
        <div className="bg-te-gray-100 p-3 border-b-2 border-black flex items-center">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-te-red"></div>
            <div className="w-3 h-3 rounded-full bg-te-yellow"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 bg-white px-4 py-1 rounded-none text-xs text-black text-center font-mono sidebar-browser-domain border-2 border-black">
            {companyDomain}/products
          </div>
        </div>
        
        {/* Browser Content */}
        <div className="p-4 overflow-y-auto" style={{
        maxHeight: "calc(100vh - 180px)"
      }}>
          <div className="flex items-center gap-3 mb-6 bg-te-gray-50 p-3 rounded-none border-2 border-black">
            {profileData?.logo_url ? <div className="h-10 w-10 flex items-center justify-center border-2 border-black rounded-none overflow-hidden bg-white p-1">
                <img src={profileData.logo_url} alt={profileData?.company_name || "Company logo"} className="object-contain w-full h-full" onError={e => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              // If image fails to load, we'll show company initials instead
              target.style.display = 'none';
              target.parentElement!.innerHTML = `
                      <div class="flex items-center justify-center w-full h-full bg-te-gray-100 text-black">
                        <span class="text-lg font-bold uppercase sidebar-company-name">${profileData?.company_name?.slice(0, 2) || 'CO'}</span>
                      </div>`;
            }} />
              </div> : <CompanyLogo website={profileData?.website || selectedCustomer?.website || ''} companyName={profileData?.company_name || selectedCustomer?.name || 'Company'} className="h-10 w-10" logoUrl={null} />}
            <h2 className="text-xl font-bold uppercase tracking-wider text-black sidebar-heading-content">Products Preview</h2>
          </div>
          
          {/* Hero Section - Updated with TE-style */}
          <div className="relative w-full h-[300px] mb-6 overflow-hidden border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <img src="/lovable-uploads/2c050251-ea30-49f9-b719-a85e8c8c54e4.png" alt="EV Charger with Wood Background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8">
              <h1 className="font-bold uppercase tracking-wider text-white mb-2 text-2xl">
                {isAllCustomersSelected ? 'All customers' : selectedCustomer ? `Welcome ${selectedCustomer.name}` : <span className="text-[42px]">Choose customers</span>}
              </h1>
              <p className="text-white/90 text-base p-2  inline-block font-mono sidebar-collapse-text">
                This is your product offering towards customers. 
              </p>
            </div>
          </div>

          {/* Asset Types Section */}
          <Card className="mb-6 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-none">
            <CardHeader className="bg-black border-b-2 border-black rounded-none">
              <CardTitle className="text-base font-bold uppercase tracking-wider text-white">Assets being optimised</CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white">
              {hasSelectedAssets ? <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedAssetTypes.map(type => <Card key={type.id} className="flex overflow-hidden border-2 border-black rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
                      <div className="w-20 shrink-0 bg-te-gray-100 border-r-2 border-black">
                        <img src={type.image} alt={type.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold uppercase tracking-wider text-sm text-black">{type.name}</h3>
                        <p className="text-xs text-te-gray-700 sidebar-collapse-text font-mono mt-1">{type.description}</p>
                      </div>
                    </Card>)}
                </div> : <div className="text-center py-8 border-2 border-dashed border-black p-4">
                  <p className="text-black font-mono sidebar-collapse-text">No assets are being optimised</p>
                </div>}
            </CardContent>
          </Card>

          {/* Savings Section */}
          <Card className="border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-none">
            <CardHeader className="bg-black border-b-2 border-black rounded-none">
              <CardTitle className="text-base font-bold uppercase tracking-wider text-white">Type of optimisation activated</CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ftmMeter?.selected && <Card className="overflow-hidden border-2 border-black rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
                    <div className="h-40 bg-te-gray-100 relative">
                      <img src="/lovable-uploads/2c050251-ea30-49f9-b719-a85e8c8c54e4.png" alt="Front of the Meter" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-te-orange text-black px-2 py-1 font-mono text-xs border border-black">Active</div>
                    </div>
                    <CardContent className="p-4 border-t-2 border-black bg-white">
                      <h3 className="font-bold uppercase tracking-wider text-black text-sm">Front of the Meter</h3>
                      <p className="text-xs text-te-gray-700 sidebar-collapse-text font-mono mt-2">
                        {ftmMeter.description}
                      </p>
                    </CardContent>
                  </Card>}
                
                {btmMeter?.selected && <Card className="overflow-hidden border-2 border-black rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
                    <div className="h-40 bg-te-gray-100 relative">
                      <img alt="Behind the Meter" className="w-full h-full object-cover" src="/lovable-uploads/92486d5d-2202-48c8-ab14-f8f1a4c3c7ba.png" />
                      <div className="absolute top-2 right-2 bg-te-orange text-black px-2 py-1 font-mono text-xs border border-black">Active</div>
                    </div>
                    <CardContent className="p-4 border-t-2 border-black bg-white">
                      <h3 className="font-bold uppercase tracking-wider text-black text-sm">Behind the Meter</h3>
                      <p className="text-xs text-te-gray-700 sidebar-collapse-text font-mono mt-2">
                        {btmMeter.description}
                      </p>
                    </CardContent>
                  </Card>}

                {/* Show message when no meter types are selected */}
                {!hasSelectedMeterTypes && <div className="col-span-2 text-center py-8 border-2 border-dashed border-black p-4">
                    <p className="text-black font-mono sidebar-collapse-text">No optimisation is activated</p>
                  </div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};