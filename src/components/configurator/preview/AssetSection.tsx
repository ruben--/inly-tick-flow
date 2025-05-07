
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetType } from '../AssetTypeCard';

interface AssetSectionProps {
  selectedAssetTypes: AssetType[];
}

export const AssetSection = ({ selectedAssetTypes }: AssetSectionProps) => {
  const hasSelectedAssets = selectedAssetTypes.length > 0;
  
  return (
    <Card className="mb-6 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-none">
      <CardHeader className="bg-black border-b-2 border-black rounded-none">
        <CardTitle className="text-base font-bold uppercase tracking-wider text-white">Assets being optimised</CardTitle>
      </CardHeader>
      <CardContent className="p-4 bg-white">
        {hasSelectedAssets ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedAssetTypes.map(type => (
              <Card key={type.id} className="flex overflow-hidden border-2 border-black rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
                <div className="w-20 shrink-0 bg-te-gray-100 border-r-2 border-black">
                  <img src={type.image} alt={type.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold uppercase tracking-wider text-sm text-black">{type.name}</h3>
                  <p className="text-xs text-te-gray-700 sidebar-collapse-text font-mono mt-1">{type.description}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-black p-4">
            <p className="text-black font-mono sidebar-collapse-text">No assets are being optimised</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
