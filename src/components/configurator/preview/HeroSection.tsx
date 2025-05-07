
import { CustomerType } from '../CustomerTypeCard';

interface HeroSectionProps {
  selectedCustomer: CustomerType | undefined;
  isAllCustomersSelected: boolean;
}

export const HeroSection = ({ selectedCustomer, isAllCustomersSelected }: HeroSectionProps) => {
  return (
    <div className="relative w-full h-[300px] mb-6 overflow-hidden border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
      <img src="/lovable-uploads/2c050251-ea30-49f9-b719-a85e8c8c54e4.png" alt="EV Charger with Wood Background" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8">
        <h1 className="font-bold uppercase tracking-wider text-white mb-2 text-2xl">
          {isAllCustomersSelected ? 'All customers' : selectedCustomer ? `Welcome ${selectedCustomer.name}` : <span className="text-[42px]">Choose customers</span>}
        </h1>
        <p className="text-white/90 text-base p-2 inline-block font-mono sidebar-collapse-text">
          This is your product offering towards customers. 
        </p>
      </div>
    </div>
  );
};
