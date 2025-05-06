
import { Checkbox } from '@/components/ui/checkbox';

export interface CustomerType {
  id: string;
  name: string;
  description: string;
  image: string;
  selected: boolean;
  website?: string; // Added website property as optional
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
          ? 'bg-white border border-black shadow-sm' 
          : 'bg-white border border-gray-200 hover:border-gray-300'
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
          <h3 className="text-black font-medium">{customerType.name}</h3>
          <Checkbox 
            checked={customerType.selected} 
            className="border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black" 
          />
        </div>
        <p className="text-sm text-black mt-1">{customerType.description}</p>
      </div>
    </div>
  );
};
