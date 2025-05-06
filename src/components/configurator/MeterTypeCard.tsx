
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
      className={`flex gap-3 p-3 rounded-md cursor-pointer border transition-all ${
        meterType.selected ? 'border-primary bg-muted/30' : 'border-border'
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
          <h3 className="font-medium">{meterType.name}</h3>
          <Checkbox checked={meterType.selected} />
        </div>
        <p className="text-sm text-muted-foreground mt-1">{meterType.description}</p>
      </div>
    </div>
  );
};
