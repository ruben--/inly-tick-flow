
import { Check, Circle } from 'lucide-react';

interface SetupStepItemProps {
  id: string;
  name: string;
  completed: boolean;
  icon: React.ReactNode;
}

export const SetupStepItem = ({ id, name, completed, icon }: SetupStepItemProps) => {
  return (
    <div 
      key={id} 
      className="flex items-center gap-2 text-xs p-2 rounded-none border border-black hover:bg-te-gray-50"
    >
      {completed ? (
        <div className="h-5 w-5 bg-te-orange flex items-center justify-center border border-black">
          <Check className="h-3 w-3 text-black" />
        </div>
      ) : (
        <div className="h-5 w-5 border border-black bg-white flex items-center justify-center">
          <Circle className="h-3 w-3 text-te-gray-400" />
        </div>
      )}
      <div className="flex items-center gap-2">
        {icon}
        <span className={completed ? "text-black font-bold" : "text-te-gray-600"}>
          {name}
        </span>
      </div>
    </div>
  );
};
