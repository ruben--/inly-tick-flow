
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
      className={`flex gap-3 p-3 rounded-md cursor-pointer border transition-all ${
        assetType.selected ? 'border-primary bg-muted/30' : 'border-border'
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
          <h3 className="font-medium">{assetType.name}</h3>
          <Checkbox checked={assetType.selected} />
        </div>
        <p className="text-sm text-muted-foreground mt-1">{assetType.description}</p>
      </div>
    </div>
  );
};
