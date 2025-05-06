
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  steps: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

const Checklist = () => {
  const navigate = useNavigate();
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, this would fetch from an API
    const items: ChecklistItem[] = [
      {
        id: '1',
        title: 'Basic Setup',
        description: 'Set up your account and company information',
        completed: false,
        steps: [
          { id: '1-1', title: 'Create account', completed: true },
          { id: '1-2', title: 'Add company details', completed: false },
          { id: '1-3', title: 'Verify email address', completed: false },
        ]
      },
      {
        id: '2',
        title: 'Energy Sources',
        description: 'Configure your distributed energy resources',
        completed: false,
        steps: [
          { id: '2-1', title: 'Add solar panels', completed: false },
          { id: '2-2', title: 'Configure battery storage', completed: false },
          { id: '2-3', title: 'Set up wind turbines', completed: false },
        ]
      },
      {
        id: '3',
        title: 'Grid Connection',
        description: 'Set up your connection to the electricity grid',
        completed: false,
        steps: [
          { id: '3-1', title: 'Add grid connection details', completed: false },
          { id: '3-2', title: 'Configure metering', completed: false },
          { id: '3-3', title: 'Set up grid compliance settings', completed: false },
        ]
      },
      {
        id: '4',
        title: 'Control Systems',
        description: 'Configure how your VPP responds to grid events',
        completed: false,
        steps: [
          { id: '4-1', title: 'Set up demand response', completed: false },
          { id: '4-2', title: 'Configure frequency regulation', completed: false },
          { id: '4-3', title: 'Set up load balancing', completed: false },
        ]
      },
      {
        id: '5',
        title: 'Testing & Verification',
        description: 'Test your VPP setup and verify it works correctly',
        completed: false,
        steps: [
          { id: '5-1', title: 'Run system test', completed: false },
          { id: '5-2', title: 'Verify communications', completed: false },
          { id: '5-3', title: 'Document test results', completed: false },
        ]
      }
    ];
    
    setChecklistItems(items);
    // Auto-expand the first incomplete item
    const firstIncomplete = items.find(item => !item.completed);
    if (firstIncomplete) {
      setExpandedItem(firstIncomplete.id);
    }
    
    // Calculate initial progress
    calculateProgress(items);
  }, []);
  
  const calculateProgress = (items: ChecklistItem[]) => {
    const totalSteps = items.reduce((acc, item) => acc + item.steps.length, 0);
    const completedSteps = items.reduce((acc, item) => 
      acc + item.steps.filter(step => step.completed).length, 0);
    
    setProgress(Math.round((completedSteps / totalSteps) * 100));
  };
  
  const toggleStep = (itemId: string, stepId: string) => {
    setChecklistItems(prev => {
      const newItems = prev.map(item => {
        if (item.id === itemId) {
          // Update the specific step
          const updatedSteps = item.steps.map(step => 
            step.id === stepId ? { ...step, completed: !step.completed } : step
          );
          
          // Check if all steps are completed
          const allStepsCompleted = updatedSteps.every(step => step.completed);
          
          return { 
            ...item, 
            steps: updatedSteps,
            completed: allStepsCompleted
          };
        }
        return item;
      });
      
      calculateProgress(newItems);
      return newItems;
    });
    
    // Show toast notification
    toast.success("Progress updated");
  };
  
  const toggleExpand = (id: string) => {
    setExpandedItem(prevId => prevId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">VPP Setup Checklist</h1>
        <p className="text-muted-foreground mt-1">
          Complete all tasks to fully configure your virtual power plant
        </p>
      </div>
      
      {/* Progress Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-3/4">
          <Progress value={progress} className="h-2" />
        </div>
        <div className="text-sm font-medium ml-2 whitespace-nowrap">
          {progress}% Complete
        </div>
        {progress === 100 && (
          <Button size="sm" onClick={() => navigate('/configure')}>
            Finalize Configuration
          </Button>
        )}
      </div>
      
      {/* Checklist */}
      <div className="space-y-4">
        {checklistItems.map((item) => (
          <Card 
            key={item.id} 
            className={`energy-card transition-all ${item.completed ? 'border-green-500 bg-green-50' : ''}`}
          >
            <CardHeader 
              className="cursor-pointer flex flex-row items-center justify-between hover:bg-muted/50 transition-colors"
              onClick={() => toggleExpand(item.id)}
            >
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.completed ? 'bg-green-500 text-white' : 'bg-muted border'}`}>
                    {item.completed ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span>{checklistItems.indexOf(item) + 1}</span>
                    )}
                  </div>
                  {item.title}
                </CardTitle>
                <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
              </div>
              <div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(item.id);
                  }}
                >
                  {expandedItem === item.id ? 'Collapse' : 'Expand'}
                </Button>
              </div>
            </CardHeader>
            
            {expandedItem === item.id && (
              <CardContent className="border-t bg-muted/20">
                <ul className="space-y-3 py-2">
                  {item.steps.map((step) => (
                    <li key={step.id} className="flex items-center gap-2">
                      <Checkbox 
                        id={step.id} 
                        checked={step.completed} 
                        onCheckedChange={() => toggleStep(item.id, step.id)}
                      />
                      <label 
                        htmlFor={step.id} 
                        className={`cursor-pointer ${step.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {step.title}
                      </label>
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Checklist;
