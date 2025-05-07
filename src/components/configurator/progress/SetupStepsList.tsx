
import { UserRound, Briefcase, ChartBar, Settings } from 'lucide-react';
import { SetupStepItem } from './SetupStepItem';

interface SetupStepsListProps {
  isProfileComplete: boolean;
  customerTypes: { id: string; name: string; selected: boolean }[];
  assetTypes: { id: string; name: string; selected: boolean }[];
  meterTypes: { id: string; name: string; selected: boolean }[];
}

export const SetupStepsList = ({ 
  isProfileComplete, 
  customerTypes, 
  assetTypes, 
  meterTypes 
}: SetupStepsListProps) => {
  
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
    <div className="mt-4 space-y-3">
      <div className="text-xs font-bold uppercase tracking-wider">Setup Steps</div>
      <div className="grid gap-2">
        {setupSteps.map((step) => (
          <SetupStepItem
            key={step.id}
            id={step.id}
            name={step.name}
            completed={step.completed}
            icon={step.icon}
          />
        ))}
      </div>
    </div>
  );
};
