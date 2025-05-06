
import { Checkbox } from '@/components/ui/checkbox';

export interface AssetType {
  id: string;
  name: string;
  description: string;
  image: string;
  selected: boolean;
}

interface AssetTypeCardProps {
  assetType: AssetType;
  onToggle: (id: string) => void;
}

export const AssetTypeCard = ({ assetType, onToggle }: AssetTypeCardProps) => {
  return (
    <div
      key={assetType.id}
      className={`flex gap-3 p-3 rounded-md cursor-pointer transition-all ${
        assetType.selected 
          ? 'bg-white border border-green-500 shadow-sm' 
          : 'bg-white border border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onToggle(assetType.id)}
    >
      <div className="w-16 h-16 overflow-hidden rounded-md shrink-0">
        <img 
          src={assetType.image} 
          alt={assetType.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="text-black font-medium">{assetType.name}</h3>
          <Checkbox 
            checked={assetType.selected} 
            className="border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black"
          />
        </div>
        <p className="text-sm text-black mt-1">{assetType.description}</p>
      </div>
    </div>
  );
};
