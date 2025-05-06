
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
      className={`flex gap-3 p-3 rounded-md cursor-pointer transition-all ${
        customerType.selected 
          ? 'bg-white/10 backdrop-blur-sm border border-primary/30' 
          : 'bg-white/5 border border-gray-800 hover:bg-white/10'
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
          <h3 className="font-medium text-white">{customerType.name}</h3>
          <Checkbox 
            checked={customerType.selected} 
            className="border-gray-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
          />
        </div>
        <p className="text-sm text-gray-300 mt-1">{customerType.description}</p>
      </div>
    </div>
  );
};
