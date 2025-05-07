
import { CustomerType } from './CustomerTypeCard';
import { AssetType } from './AssetTypeCard';
import { MeterType } from './MeterTypeCard';
import { Checkbox } from '@/components/ui/checkbox';

interface ConfigSidebarItemProps {
  itemType: CustomerType | AssetType | MeterType;
  onToggle: () => void;
}

export const ConfigSidebarItem = ({ itemType, onToggle }: ConfigSidebarItemProps) => {
  return (
    <div 
      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all 
        ${itemType.selected 
          ? 'bg-white text-black border border-black' 
          : 'hover:bg-white/80 hover:text-black hover:border hover:border-black/50'
        }`}
      onClick={onToggle}
    >
      <div className="w-8 h-8 overflow-hidden rounded-md shrink-0">
        <img 
          src={itemType.image} 
          alt={itemType.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium truncate">{itemType.name}</p>
          <Checkbox 
            checked={itemType.selected}
            className="ml-2 shrink-0"
          />
        </div>
      </div>
    </div>
  );
};
