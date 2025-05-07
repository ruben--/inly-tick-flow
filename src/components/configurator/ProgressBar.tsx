
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
        
        // Call the callback with the profile status
        if (onProfileStatusChange) {
          onProfileStatusChange(!!profileComplete);
        }
      } catch (error) {
        console.error("Error checking profile status:", error);
      }
    };
    
    checkProfileStatus();
  }, [user, onProfileStatusChange]);

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
          <div className="flex justify-between text-xs">
            <span>{progress}% Complete</span>
            <span className="text-te-gray-600">
              {completedTasks} of {totalTasks} tasks completed
            </span>
          </div>
          <div className="w-full bg-te-gray-200 h-2 rounded-none overflow-hidden border border-black">
            <div 
              className="bg-te-orange h-full rounded-none transition-all duration-500 ease-in-out"
              style={{
                width: `${progress}%`
              }}
            ></div>
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider">Setup Steps</div>
            <div className="grid gap-2">
              {setupSteps.map((step) => (
                <div 
                  key={step.id} 
                  className="flex items-center gap-2 text-xs p-2 rounded-none border border-black hover:bg-te-gray-50"
                >
                  {step.completed ? (
                    <div className="h-5 w-5 bg-te-orange flex items-center justify-center border border-black">
                      <Check className="h-3 w-3 text-black" />
                    </div>
                  ) : (
                    <div className="h-5 w-5 border border-black bg-white flex items-center justify-center">
                      <Circle className="h-3 w-3 text-te-gray-400" />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {step.icon}
                    <span className={step.completed ? "text-black font-bold" : "text-te-gray-600"}>
                      {step.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {progress === 100 ? (
            <div className="mt-2 text-xs text-black bg-te-orange p-2 border border-black">
              All steps completed! Your VPP is fully configured.
            </div>
          ) : (
            <div className="mt-2 text-xs text-te-gray-600">
              Complete all steps to finalize your VPP configuration.
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
