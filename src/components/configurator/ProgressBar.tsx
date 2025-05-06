
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Check, Circle, UserRound, Briefcase, ChartBar, Settings } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);

  // Check if profile is complete
  useEffect(() => {
    const checkProfileStatus = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('company_name, first_name, last_name, role, website')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error("Error checking profile:", error);
          return;
        }
        
        // Check if all required profile fields are filled
        const profileComplete = data && 
          data.company_name && 
          data.first_name && 
          data.last_name && 
          data.role && 
          data.website;
        
        setIsProfileComplete(!!profileComplete);
      } catch (error) {
        console.error("Error checking profile status:", error);
      }
    };
    
    checkProfileStatus();
  }, [user]);

  // Define the four main setup steps
  const setupSteps = [
    {
      id: 'profile',
      name: 'Setup Company Profile',
      completed: isProfileComplete,
      icon: <UserRound className="h-4 w-4" />
    },
    {
      id: 'customer-types',
      name: 'Choose Customer Types',
      completed: customerTypes.some(type => type.selected),
      icon: <Briefcase className="h-4 w-4" />
    },
    {
      id: 'assets',
      name: 'Choose Assets',
      completed: assetTypes.some(type => type.selected),
      icon: <Settings className="h-4 w-4" />
    },
    {
      id: 'optimization',
      name: 'Choose Optimisation Type',
      completed: meterTypes.some(type => type.selected),
      icon: <ChartBar className="h-4 w-4" />
    }
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
            <div className="text-sm font-medium">Setup Steps</div>
            <div className="grid gap-2">
              {setupSteps.map((step) => (
                <div 
                  key={step.id} 
                  className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-secondary/50"
                >
                  {step.completed ? (
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex items-center gap-2">
                    {step.icon}
                    <span className={step.completed ? "text-foreground" : "text-muted-foreground"}>
                      {step.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {progress === 100 ? (
            <div className="mt-2 text-sm text-green-600">
              All steps completed! Your VPP is fully configured.
            </div>
          ) : (
            <div className="mt-2 text-sm text-muted-foreground">
              Complete all steps to finalize your VPP configuration.
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
