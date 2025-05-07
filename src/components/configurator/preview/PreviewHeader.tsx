
import { CompanyLogo } from '@/components/profile/CompanyLogo';

interface PreviewHeaderProps {
  logoImage: string | null;
  logoUrl: string | null;
  companyName: string | null;
  website: string | null;
}

export const PreviewHeader = ({ logoImage, logoUrl, companyName, website }: PreviewHeaderProps) => {
  return (
    <div className="flex items-center gap-3 mb-6 bg-te-gray-50 p-3 rounded-none border-2 border-black">
      {logoImage ? (
        <div className="h-10 w-10 flex items-center justify-center border-2 border-black rounded-none overflow-hidden bg-white p-1">
          <img 
            src={logoImage} 
            alt={companyName || "Company logo"} 
            className="object-contain w-full h-full" 
          />
        </div>
      ) : (
        <CompanyLogo 
          website={website || ''} 
          companyName={companyName || 'Company'} 
          className="h-10 w-10" 
          logoUrl={logoUrl}
          logoImage={null}
        />
      )}
      <h2 className="text-xl font-bold uppercase tracking-wider text-black sidebar-heading-content">Products Preview</h2>
    </div>
  );
};
