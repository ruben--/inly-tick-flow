
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
          ? 'bg-white/10 backdrop-blur-sm border border-primary/30' 
          : 'bg-white/5 border border-gray-800 hover:bg-white/10'
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
          <h3 className="font-medium text-white">{assetType.name}</h3>
          <Checkbox 
            checked={assetType.selected} 
            className="border-gray-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
          />
        </div>
        <p className="text-sm text-gray-300 mt-1">{assetType.description}</p>
      </div>
    </div>
  );
};
