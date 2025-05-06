
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Mail, Briefcase } from 'lucide-react';

const Index = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { loginWithSSO } = useAuth();
  const navigate = useNavigate();
  
  const handleSSOLogin = async (provider: 'google' | 'azure') => {
    setIsLoading(provider);
    try {
      await loginWithSSO(provider);
      // No need to navigate here as the OAuth flow will redirect
    } catch (error) {
      toast.error(`${provider === 'azure' ? 'Microsoft' : 'Google'} login failed. Please try again.`);
      setIsLoading(null);
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center z-10 relative">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-6 gradient-text">Fever Control Room</h1>
          <p className="text-center text-muted-foreground mb-8">
            Configure and manage your virtual power plant with our intuitive platform
          </p>
          
          <Card className="w-full backdrop-blur-sm bg-card/80">
            <CardHeader>
              <CardTitle className="text-center">Sign in with SSO</CardTitle>
              <CardDescription className="text-center">
                Continue with your preferred authentication provider
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Button 
                className="w-full flex items-center justify-center gap-2"
                variant="outline" 
                onClick={() => handleSSOLogin('google')}
                disabled={isLoading !== null}
              >
                <Mail size={18} />
                {isLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
              </Button>
              
              <Button 
                className="w-full flex items-center justify-center gap-2" 
                onClick={() => handleSSOLogin('azure')}
                disabled={isLoading !== null}
              >
                <Briefcase size={18} />
                {isLoading === 'azure' ? 'Connecting...' : 'Continue with Microsoft'}
              </Button>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                By continuing, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Index;
