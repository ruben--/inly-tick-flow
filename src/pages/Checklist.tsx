
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProgressBar } from '@/components/configurator/ProgressBar';
import { supabase } from '@/integrations/supabase/client';
import { useChecklistConfig } from '@/hooks/useChecklistConfig';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Checklist = () => {
  const { user } = useAuth();
  const [profileCompleted, setProfileCompleted] = useState(false);
  
  const {
    loading,
    customerTypes,
    assetTypes,
    meterTypes,
    selectedCustomer,
    selectedAssetTypes,
  } = useChecklistConfig(user?.id);
  
  // Calculate progress statistics
  const completedTasks = [
    profileCompleted,
    !!selectedCustomer,
    selectedAssetTypes.length > 0,
    meterTypes.some(type => type.selected)
  ].filter(Boolean).length;
  
  const totalTasks = 4; // Profile, Customer Type, Assets, Meters
  const progress = Math.round((completedTasks / totalTasks) * 100);
  
  // Check if profile is complete
  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!user?.id) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (data && data.company_name && data.first_name && 
            data.last_name && data.website && data.role) {
          setProfileCompleted(true);
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      }
    };
    
    checkProfileCompletion();
  }, [user]);

  if (loading) {
    return (
      <div className="container py-8 mx-auto">
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="flex justify-center items-center h-40">
              <div className="animate-pulse text-center">
                <p className="text-lg text-muted-foreground">Loading your checklist...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      {user ? (
        <div className="space-y-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>VPP Setup Checklist</CardTitle>
              <CardDescription>
                Complete these tasks to set up your Virtual Power Plant
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ProgressBar 
                progress={progress}
                completedTasks={completedTasks}
                totalTasks={totalTasks}
                customerTypes={customerTypes}
                assetTypes={assetTypes}
                meterTypes={meterTypes}
              />
              
              {progress === 100 ? (
                <div className="text-center py-4 text-green-600 font-medium">
                  All tasks completed! Your VPP is fully configured.
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Complete all tasks to finalize your VPP configuration.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-16">
          <p>Please log in to access the checklist.</p>
        </div>
      )}
    </div>
  );
};

export default Checklist;
