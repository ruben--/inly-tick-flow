
import { CompanyLogo } from '@/components/profile/CompanyLogo';

interface PreviewHeaderProps {
  companyName: string | null;
  website: string | null;
}

export const PreviewHeader = ({ 
  companyName, 
  website
}: PreviewHeaderProps) => {  
  return (
    <div className="flex flex-col items-center mb-6 bg-white p-3 rounded-none border-2 border-black">
      <div className="h-20 w-20 mb-3 flex items-center justify-center overflow-hidden bg-white">
        <CompanyLogo 
          website={website || undefined}
          companyName={companyName || 'Company'} 
          className="h-full w-full" 
        />
      </div>
      <h2 className="text-xl font-mono uppercase tracking-wider text-black sidebar-heading-content">Products Preview</h2>
    </div>
  );
};
