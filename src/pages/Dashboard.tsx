
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Mock tasks - in a real app these would come from an API
    const mockTasks: Task[] = [
      { 
        id: '1', 
        title: 'Complete Basic Information', 
        description: 'Add your company details and contact information',
        completed: true 
      },
      { 
        id: '2', 
        title: 'Set Up Grid Connection', 
        description: 'Configure your connection to the grid',
        completed: false 
      },
      { 
        id: '3', 
        title: 'Add Energy Sources', 
        description: 'Add solar, wind, storage and other energy sources',
        completed: false 
      },
      { 
        id: '4', 
        title: 'Configure Control Systems', 
        description: 'Set up your VPP control parameters',
        completed: false 
      }
    ];
    
    setTasks(mockTasks);
    
    // Calculate progress
    const completedCount = mockTasks.filter(task => task.completed).length;
    setProgress(Math.round((completedCount / mockTasks.length) * 100));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your VPP setup progress
          </p>
        </div>
        <Button asChild>
          <Link to="/configure">Configure VPP</Link>
        </Button>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Setup Progress</CardTitle>
          <CardDescription>Complete all tasks to finalize your VPP configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-2 items-center">
            <div className="text-sm font-medium">
              {progress}% Complete
            </div>
            <Link to="/checklist" className="text-sm text-primary hover:underline">
              View All Tasks
            </Link>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Quick Tasks */}
      <div>
        <h2 className="text-xl font-medium mb-4">Pending Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks
            .filter(task => !task.completed)
            .slice(0, 3)
            .map((task) => (
              <Card key={task.id} className="energy-card">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">{task.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/checklist">Start Task</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
            
          {tasks.filter(task => !task.completed).length === 0 && (
            <Card className="col-span-full">
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground">
                  All tasks completed! Your VPP is fully configured.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* VPP Overview */}
      <Card>
        <CardHeader>
          <CardTitle>VPP Status</CardTitle>
        </CardHeader>
        <CardContent>
          {progress < 100 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">Complete the setup tasks to activate your VPP</p>
              <Button asChild>
                <Link to="/checklist">Continue Setup</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Total Capacity</div>
                <div className="text-2xl font-bold">24.5 MW</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Current Output</div>
                <div className="text-2xl font-bold">18.2 MW</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Efficiency</div>
                <div className="text-2xl font-bold">94%</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
