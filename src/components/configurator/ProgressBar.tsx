
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Check, Circle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TaskItem {
  id: string;
  name: string;
  completed: boolean;
  type: 'customer' | 'asset' | 'meter';
}

interface ProgressBarProps {
  progress: number;
  completedTasks: number;
  totalTasks: number;
  customerTypes: { id: string; name: string; selected: boolean }[];
  assetTypes: { id: string; name: string; selected: boolean }[];
  meterTypes: { id: string; name: string; selected: boolean }[];
}

export const ProgressBar = ({ 
  progress, 
  completedTasks, 
  totalTasks,
  customerTypes,
  assetTypes,
  meterTypes
}: ProgressBarProps) => {
  const [isOpen, setIsOpen] = useState(true);

  // Create a unified list of all task items
  const allTasks: TaskItem[] = [
    ...customerTypes.map(type => ({
      id: type.id,
      name: `Select ${type.name} Customer Type`,
      completed: type.selected,
      type: 'customer' as const
    })),
    ...assetTypes.map(type => ({
      id: type.id,
      name: `Configure ${type.name} Asset`,
      completed: type.selected,
      type: 'asset' as const
    })),
    ...meterTypes.map(type => ({
      id: type.id,
      name: `Set up ${type.name} Meter Type`,
      completed: type.selected,
      type: 'meter' as const
    }))
  ];

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
          
          <div className="mt-4 space-y-3">
            <div className="text-sm font-medium">Task Status</div>
            <div className="grid gap-2">
              {allTasks.map((task) => (
                <div 
                  key={`${task.type}-${task.id}`} 
                  className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-secondary/50"
                >
                  {task.completed ? (
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <span className={task.completed ? "text-foreground" : "text-muted-foreground"}>
                    {task.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
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
