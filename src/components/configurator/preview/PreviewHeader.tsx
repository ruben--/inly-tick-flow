
import { CompanyLogo } from '@/components/profile/CompanyLogo';

interface PreviewHeaderProps {
  companyName: string | null;
  website: string | null;
  logoImage?: string | null;
  onRefreshLogo?: () => void; // Keeping prop for compatibility but not using it
}

export const PreviewHeader = ({ 
  companyName, 
  website, 
  logoImage
}: PreviewHeaderProps) => {
  return (
    <div className="flex flex-col items-center mb-6 bg-te-gray-50 p-3 rounded-none border-2 border-black">
      <div className="h-12 w-12 mb-3 flex items-center justify-center overflow-hidden bg-white">
        <CompanyLogo 
          website={website || ''} 
          companyName={companyName || 'Company'} 
          logoImage={logoImage}
          className="h-full w-full" 
          isLoading={false}
        />
      </div>
      <h2 className="text-xl font-bold uppercase tracking-wider text-black sidebar-heading-content">Products Preview</h2>
    </div>
  );
};
