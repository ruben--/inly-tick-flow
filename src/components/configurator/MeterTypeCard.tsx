
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
          ? 'bg-white border border-black shadow-sm' 
          : 'bg-white border border-gray-200 hover:border-gray-300'
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
          <h3 className="text-black">{meterType.name}</h3>
          <Checkbox 
            checked={meterType.selected}
            className="border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black"
          />
        </div>
        <p className="text-sm text-black mt-1">{meterType.description}</p>
      </div>
    </div>
  );
};
