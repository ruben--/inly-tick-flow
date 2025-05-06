
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormLabel } from '@/components/ui/form';
import { CheckCircle, ArrowRight, ArrowLeft, UserRound, Briefcase, Banknote, ChartBar } from 'lucide-react';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ConfigSidebar } from './ConfigSidebar';
import { useChecklistConfig } from '@/hooks/useChecklistConfig';
import { useAuth } from '@/contexts/AuthContext';

// Define all steps in the wizard
type Step = 'profile' | 'customer' | 'assets' | 'optimization' | 'complete';

export const ChecklistWizard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('profile');
  const [profileCompleted, setProfileCompleted] = useState(false);
  
  const {
    loading,
    customerTypes,
    assetTypes,
    meterTypes,
    toggleCustomerType,
    toggleAssetType,
    toggleMeterType,
    selectedCustomer,
    selectedAssetTypes,
  } = useChecklistConfig(user?.id);
  
  // Check step completion status
  const isStepComplete = (step: Step): boolean => {
    switch (step) {
      case 'profile':
        return profileCompleted;
      case 'customer':
        return !!selectedCustomer;
      case 'assets':
        return selectedAssetTypes.length > 0;
      case 'optimization':
        return meterTypes.some(type => type.selected);
      case 'complete':
        return true;
      default:
        return false;
    }
  };
  
  // Check if current step is complete and can proceed
  const canProceed = isStepComplete(currentStep);
  
  // Move to next step
  const handleNext = () => {
    if (canProceed) {
      switch (currentStep) {
        case 'profile':
          setCurrentStep('customer');
          break;
        case 'customer':
          setCurrentStep('assets');
          break;
        case 'assets':
          setCurrentStep('optimization');
          break;
        case 'optimization':
          setCurrentStep('complete');
          break;
        case 'complete':
          navigate('/dashboard');
          break;
      }
    }
  };
  
  // Move to previous step
  const handleBack = () => {
    switch (currentStep) {
      case 'customer':
        setCurrentStep('profile');
        break;
      case 'assets':
        setCurrentStep('customer');
        break;
      case 'optimization':
        setCurrentStep('assets');
        break;
      case 'complete':
        setCurrentStep('optimization');
        break;
    }
  };
  
  // Check if profile is complete when the component mounts
  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!user?.id) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (data && 
            data.company_name && 
            data.first_name && 
            data.last_name && 
            data.website && 
            data.role) {
          setProfileCompleted(true);
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      }
    };
    
    checkProfileCompletion();
  }, [user]);
  
  // Update profile completion status when user completes profile
  const handleProfileComplete = () => {
    setProfileCompleted(true);
  };
  
  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-center">
              <p className="text-lg text-muted-foreground">Loading your checklist...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render the appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'profile':
        return (
          <div className="space-y-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5" />
                Step 1: Complete Your Profile
              </CardTitle>
              <CardDescription>
                Please fill out your profile information to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm onProfileComplete={handleProfileComplete} />
            </CardContent>
          </div>
        );
        
      case 'customer':
        return (
          <div className="space-y-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Step 2: Select Your Customer Type
              </CardTitle>
              <CardDescription>
                Choose the type of customers you want to serve
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup className="space-y-4">
                {customerTypes.map(type => (
                  <div 
                    key={type.id}
                    className={`flex items-center space-x-2 p-4 rounded-md border cursor-pointer ${
                      type.selected ? 'border-primary bg-muted/30' : 'border-border'
                    }`}
                    onClick={() => toggleCustomerType(type.id)}
                  >
                    <RadioGroupItem value={type.id} id={type.id} checked={type.selected} />
                    <FormLabel htmlFor={type.id} className="flex-1 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 overflow-hidden rounded-md shrink-0">
                          <img 
                            src={type.image} 
                            alt={type.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </FormLabel>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </div>
        );
        
      case 'assets':
        return (
          <div className="space-y-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Step 3: Select Your Assets
              </CardTitle>
              <CardDescription>
                Choose one or more assets that you want to optimize
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assetTypes.map(type => (
                  <div 
                    key={type.id}
                    className={`flex items-center space-x-2 p-4 rounded-md border cursor-pointer ${
                      type.selected ? 'border-primary bg-muted/30' : 'border-border'
                    }`}
                    onClick={() => toggleAssetType(type.id)}
                  >
                    <input 
                      type="checkbox" 
                      id={type.id} 
                      checked={type.selected}
                      onChange={() => {}}
                      className="h-4 w-4"
                    />
                    <label htmlFor={type.id} className="flex-1 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 overflow-hidden rounded-md shrink-0">
                          <img 
                            src={type.image} 
                            alt={type.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        );
        
      case 'optimization':
        return (
          <div className="space-y-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar className="h-5 w-5" />
                Step 4: Select Optimization Settings
              </CardTitle>
              <CardDescription>
                Choose how you want to optimize your assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meterTypes.map(type => (
                  <div 
                    key={type.id}
                    className={`flex items-center space-x-2 p-4 rounded-md border cursor-pointer ${
                      type.selected ? 'border-primary bg-muted/30' : 'border-border'
                    }`}
                    onClick={() => toggleMeterType(type.id)}
                  >
                    <input 
                      type="checkbox" 
                      id={type.id} 
                      checked={type.selected}
                      onChange={() => {}}
                      className="h-4 w-4"
                    />
                    <label htmlFor={type.id} className="flex-1 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 overflow-hidden rounded-md shrink-0">
                          <img 
                            src={type.image} 
                            alt={type.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        );
        
      case 'complete':
        return (
          <div className="space-y-6">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Setup Complete!</CardTitle>
              <CardDescription className="text-center">
                Congratulations, you've completed all the required steps
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div className="text-center space-y-2 max-w-lg">
                <p>Your system is now configured with:</p>
                <ul className="space-y-1 text-left ml-6 list-disc">
                  {selectedCustomer && (
                    <li>Customer type: <span className="font-medium">{selectedCustomer.name}</span></li>
                  )}
                  {selectedAssetTypes.length > 0 && (
                    <li>
                      Assets: <span className="font-medium">
                        {selectedAssetTypes.map(a => a.name).join(', ')}
                      </span>
                    </li>
                  )}
                  {meterTypes.filter(m => m.selected).length > 0 && (
                    <li>
                      Optimization: <span className="font-medium">
                        {meterTypes.filter(m => m.selected).map(m => m.name).join(', ')}
                      </span>
                    </li>
                  )}
                </ul>
                <p className="pt-4">You can now proceed to your dashboard.</p>
              </div>
            </CardContent>
          </div>
        );
    }
  };
  
  // Render step indicators
  const renderStepIndicators = () => {
    const steps: { key: Step; label: string; icon: JSX.Element }[] = [
      { key: 'profile', label: 'Profile', icon: <UserRound className="h-4 w-4" /> },
      { key: 'customer', label: 'Customer', icon: <Briefcase className="h-4 w-4" /> },
      { key: 'assets', label: 'Assets', icon: <Banknote className="h-4 w-4" /> },
      { key: 'optimization', label: 'Optimize', icon: <ChartBar className="h-4 w-4" /> }
    ];
    
    return (
      <div className="flex justify-between items-center w-full mb-6">
        {steps.map((step, index) => {
          const isActive = currentStep === step.key;
          const isComplete = isStepComplete(step.key);
          const isVisited = steps.findIndex(s => s.key === currentStep) > index;
          
          return (
            <div key={step.key} className="flex items-center">
              <div 
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full 
                  ${isComplete ? 'bg-green-100 text-green-600' : isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                `}
              >
                {isComplete ? <CheckCircle className="h-4 w-4" /> : step.icon}
              </div>
              
              <span 
                className={`
                  hidden sm:block text-sm ml-2 
                  ${isActive ? 'font-medium' : 'text-muted-foreground'}
                `}
              >
                {step.label}
              </span>
              
              {index < steps.length - 1 && (
                <div 
                  className={`
                    h-[2px] w-8 sm:w-12 mx-1 
                    ${isVisited || (isActive && isComplete) ? 'bg-primary' : 'bg-muted'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="w-full">
        <CardContent className="p-6">
          {renderStepIndicators()}
          {renderStepContent()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 'profile'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center gap-2"
            >
              {currentStep === 'complete' ? 'Go to Dashboard' : 'Next'}
              {currentStep !== 'complete' && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
