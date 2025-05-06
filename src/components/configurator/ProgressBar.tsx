
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Check, Circle, UserRound, Briefcase, ChartBar, Settings, X } from 'lucide-react';
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
  const [isPermanentlyHidden, setIsPermanentlyHidden] = useState<boolean>(false);

  // Check if progress bar should be hidden based on localStorage
  useEffect(() => {
    const hiddenState = localStorage.getItem('progressBarHidden');
    if (hiddenState === 'true') {
      setIsPermanentlyHidden(true);
    }
  }, []);

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

  // Function to permanently hide the progress bar
  const handlePermanentHide = () => {
    localStorage.setItem('progressBarHidden', 'true');
    setIsPermanentlyHidden(true);
  };

  // If permanently hidden, don't render anything
  if (isPermanentlyHidden) {
    return null;
  }

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
      className="relative w-full bg-white mb-6 rounded-lg p-4 border border-gray-200 text-gray-800 shadow-sm font-fever"
    >
      {/* Close button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100 rounded-full" 
        onClick={handlePermanentHide}
        title="Hide progress bar permanently"
      >
        <X className="h-3 w-3" />
      </Button>
      
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">
          Setup Progress ({completedTasks}/{totalTasks})
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>{progress}% Complete</span>
            <span className="text-gray-500">
              {completedTasks} of {totalTasks} tasks completed
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-100" />
          
          <div className="mt-4 space-y-3">
            <div className="text-sm font-medium">Setup Steps</div>
            <div className="grid gap-2">
              {setupSteps.map((step) => (
                <div 
                  key={step.id} 
                  className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-gray-50"
                >
                  {step.completed ? (
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400 shrink-0" />
                  )}
                  <div className="flex items-center gap-2">
                    {step.icon}
                    <span className={step.completed ? "text-gray-900" : "text-gray-500"}>
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
            <div className="mt-2 text-sm text-gray-500">
              Complete all steps to finalize your VPP configuration.
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
