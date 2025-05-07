
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useProgressBar } from './progress/useProgressBar';
import { ProgressIndicator } from './progress/ProgressIndicator';
import { SetupStepsList } from './progress/SetupStepsList';
import { ProgressSummary } from './progress/ProgressSummary';

interface ProgressBarProps {
  progress: number;
  completedTasks: number;
  totalTasks: number;
  customerTypes: { id: string; name: string; selected: boolean }[];
  assetTypes: { id: string; name: string; selected: boolean }[];
  meterTypes: { id: string; name: string; selected: boolean }[];
  onProfileStatusChange?: (isComplete: boolean) => void;
}

export const ProgressBar = ({ 
  progress, 
  completedTasks, 
  totalTasks,
  customerTypes,
  assetTypes,
  meterTypes,
  onProfileStatusChange
}: ProgressBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isProfileComplete, isPermanentlyHidden, handlePermanentHide } = useProgressBar(onProfileStatusChange);

  // If permanently hidden, don't render anything
  if (isPermanentlyHidden) {
    return null;
  }

  return (
    <Collapsible 
      open={isOpen}
      onOpenChange={setIsOpen}
      className="relative w-full bg-white mb-6 rounded-none p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] text-black font-mono"
    >
      {/* Close button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-te-red hover:text-white rounded-none" 
        onClick={handlePermanentHide}
        title="Hide progress bar permanently"
      >
        <X className="h-3 w-3" />
      </Button>
      
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold uppercase tracking-wider text-xs">
          Setup Progress ({completedTasks}/{totalTasks})
        </div>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-black hover:text-black hover:bg-te-orange border border-black rounded-none"
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent>
        <div className="space-y-3">
          <ProgressIndicator 
            progress={progress} 
            completedTasks={completedTasks} 
            totalTasks={totalTasks} 
          />
          
          <SetupStepsList 
            isProfileComplete={isProfileComplete} 
            customerTypes={customerTypes} 
            assetTypes={assetTypes} 
            meterTypes={meterTypes} 
          />
          
          <ProgressSummary progress={progress} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
