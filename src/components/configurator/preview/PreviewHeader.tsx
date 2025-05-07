
import { CompanyLogo } from '@/components/profile/CompanyLogo';

interface PreviewHeaderProps {
  companyName: string | null;
  website: string | null;
  logoImage?: string | null;
  logoLoading?: boolean;
  onRefreshLogo?: () => void;
}

export const PreviewHeader = ({ 
  companyName, 
  website, 
  logoImage,
  logoLoading = false
}: PreviewHeaderProps) => {
  return (
    <div className="flex flex-col items-center mb-6 bg-white p-3 rounded-none border-2 border-black">
      <div className="h-12 w-12 mb-3 flex items-center justify-center overflow-hidden bg-white">
        <CompanyLogo 
          website={website || ''} 
          companyName={companyName || 'Company'} 
          logoImage={logoImage}
          className="h-full w-full" 
          isLoading={logoLoading}
        />
      </div>
      <h2 className="text-xl font-bold uppercase tracking-wider text-black sidebar-heading-content">Products Preview</h2>
    </div>
  );
};
