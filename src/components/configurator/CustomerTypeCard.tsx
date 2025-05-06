
import { Checkbox } from '@/components/ui/checkbox';

export interface CustomerType {
  id: string;
  name: string;
  description: string;
  image: string;
  selected: boolean;
}

interface CustomerTypeCardProps {
  customerType: CustomerType;
  onToggle: (id: string) => void;
}

export const CustomerTypeCard = ({ customerType, onToggle }: CustomerTypeCardProps) => {
  return (
    <div 
      key={customerType.id}
      className={`flex gap-3 p-3 rounded-md cursor-pointer border transition-all ${
        customerType.selected ? 'border-primary bg-muted/30' : 'border-border'
      }`}
      onClick={() => onToggle(customerType.id)}
    >
      <div className="w-16 h-16 overflow-hidden rounded-md shrink-0">
        <img 
          src={customerType.image} 
          alt={customerType.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{customerType.name}</h3>
          <Checkbox checked={customerType.selected} />
        </div>
        <p className="text-sm text-muted-foreground mt-1">{customerType.description}</p>
      </div>
    </div>
  );
};
