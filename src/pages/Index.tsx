
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
          Virtual Power Plant Orchestration Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Configure and manage your virtual power plant with our intuitive platform. 
          Optimize energy distribution, improve reliability, and reduce costs.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {user ? (
            <Button size="lg" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our VPP Platform?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="energy-card bg-white p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Easy Setup</h3>
              <p className="text-muted-foreground">
                Configure your virtual power plant in minutes with our step-by-step checklist and intuitive interface.
              </p>
            </div>
            
            <div className="energy-card bg-white p-6">
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4 text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-3">
                  <path d="M3 3v18h18" />
                  <path d="M18 17V9" />
                  <path d="M13 17V5" />
                  <path d="M8 17v-3" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Optimize Performance</h3>
              <p className="text-muted-foreground">
                Advanced algorithms help you maximize efficiency and minimize costs across your energy assets.
              </p>
            </div>
            
            <div className="energy-card bg-white p-6">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Reliable & Secure</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security and reliability ensure your virtual power plant operates smoothly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join thousands of energy providers who trust our platform for their VPP needs.
        </p>
        <Button size="lg" asChild>
          <Link to={user ? "/dashboard" : "/signup"}>
            {user ? "Go to Dashboard" : "Sign Up Now"}
          </Link>
        </Button>
      </section>
    </div>
  );
};

export default Index;
