
import { CompanyLogo } from '@/components/profile/CompanyLogo';

interface PreviewHeaderProps {
  companyName: string | null;
  website: string | null;
  logoImage?: string | null;
}

export const PreviewHeader = ({ companyName, website, logoImage }: PreviewHeaderProps) => {
  return (
    <div className="flex items-center gap-3 mb-6 bg-te-gray-50 p-3 rounded-none border-2 border-black">
      <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center border-2 border-black rounded-none overflow-hidden bg-white p-1">
        <CompanyLogo 
          website={website || ''} 
          companyName={companyName || 'Company'} 
          logoImage={logoImage}
          className="h-full w-full" 
        />
      </div>
      <h2 className="text-xl font-bold uppercase tracking-wider text-black sidebar-heading-content">Products Preview</h2>
    </div>
  );
};
