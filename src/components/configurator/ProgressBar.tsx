
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ProgressBarProps {
  progress: number;
  completedTasks: number;
  totalTasks: number;
}

export const ProgressBar = ({ progress, completedTasks, totalTasks }: ProgressBarProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible 
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full bg-muted mb-6 rounded-lg p-4 border"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">
          Setup Progress ({completedTasks}/{totalTasks})
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>{progress}% Complete</span>
            <span className="text-muted-foreground">
              {completedTasks} of {totalTasks} tasks completed
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {progress === 100 ? (
            <div className="mt-2 text-sm text-green-600">
              All tasks completed! Your VPP is fully configured.
            </div>
          ) : (
            <div className="mt-2 text-sm text-muted-foreground">
              Complete all tasks to finalize your VPP configuration.
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
