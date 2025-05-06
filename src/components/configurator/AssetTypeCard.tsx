
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
          ? 'bg-white/90 border border-green-300 shadow-sm' 
          : 'bg-white/80 border border-gray-200 hover:bg-white hover:border-gray-300'
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
          <h3 className="text-gray-900">{assetType.name}</h3>
          <Checkbox 
            checked={assetType.selected} 
            className="border-gray-300 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">{assetType.description}</p>
      </div>
    </div>
  );
};
