import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AnimatedBackground from '@/components/AnimatedBackground';
const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const {
    login,
    signup,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    }
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await signup(email, password, name);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create account. Please try again.');
    }
  };
  return <>
      <AnimatedBackground />
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center z-10 relative">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-6 gradient-text">Fever Control Room</h1>
          <p className="text-center text-muted-foreground mb-8">
            Configure and manage your virtual power plant with our intuitive platform
          </p>
          
          <Card className="w-full backdrop-blur-sm bg-card/80">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-login">Email</Label>
                      <Input id="email-login" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password-login">Password</Label>
                        <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <Input id="password-login" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-signup">Email</Label>
                      <Input id="email-signup" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-signup">Password</Label>
                      <Input id="password-signup" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
          
          <p className="text-center mt-8 text-sm text-muted-foreground">
            By continuing, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </>;
};
export default Index;