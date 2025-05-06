
import { Checkbox } from '@/components/ui/checkbox';

export interface MeterType {
  id: string;
  name: string;
  description: string;
  image: string;
  selected: boolean;
}

interface MeterTypeCardProps {
  meterType: MeterType;
  onToggle: (id: string) => void;
}

export const MeterTypeCard = ({ meterType, onToggle }: MeterTypeCardProps) => {
  return (
    <div
      key={meterType.id}
      className={`flex gap-3 p-3 rounded-md cursor-pointer transition-all ${
        meterType.selected 
          ? 'bg-gray-800 border border-primary/30' 
          : 'bg-gray-900/70 border border-gray-800 hover:bg-gray-800/50'
      }`}
      onClick={() => onToggle(meterType.id)}
    >
      <div className="w-16 h-16 overflow-hidden rounded-md shrink-0">
        <img 
          src={meterType.image} 
          alt={meterType.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium text-white">{meterType.name}</h3>
          <Checkbox 
            checked={meterType.selected}
            className="border-gray-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
          />
        </div>
        <p className="text-sm text-gray-300 mt-1">{meterType.description}</p>
      </div>
    </div>
  );
};
