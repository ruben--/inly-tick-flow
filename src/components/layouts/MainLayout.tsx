
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Check, Cog, User } from 'lucide-react';
import { ProfileRequiredModal } from '@/components/ProfileRequiredModal';
import { PageTransition } from '@/components/transitions/PageTransition';
import { Dialog } from '@/components/ui/dialog';
import { useLogo } from '@/contexts/LogoContext';
import { supabase } from '@/integrations/supabase/client';

export function MainLayout() {
  const {
    user,
    logout
  } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false); // Default to false so modal shows immediately if needed
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Hide header and footer on index page
  const isIndexPage = location.pathname === '/';
  
  useEffect(() => {
    if (user && !isIndexPage) {
      // Check if profile is complete
      const checkProfileCompletion = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('company_name, website')
            .eq('id', user.id)
            .maybeSingle();
            
          if (error) throw error;
          
          // Profile is incomplete if company name or website is missing
          const profileIncomplete = !data || !data.company_name || !data.website;
          setIsProfileComplete(!profileIncomplete);
          setShowProfileModal(true); // Always set to true initially, the Dialog will only show if profile is incomplete
        } catch (error) {
          console.error('Error checking profile:', error);
          setIsProfileComplete(false);
          setShowProfileModal(true);
        }
      };
      
      checkProfileCompletion();
    }
  }, [user, isIndexPage]);

  const handleProfileComplete = () => {
    setIsProfileComplete(true);
    setShowProfileModal(false);
  };

  return <div className="min-h-screen flex flex-col">
      {user && !isIndexPage && (
        <Dialog 
          open={showProfileModal && !isProfileComplete} 
          onOpenChange={(open) => {
            // Only allow closing if profile is complete
            if (!open && !isProfileComplete) {
              return; // Prevent dialog from closing
            }
            setShowProfileModal(open);
          }}
        >
          <ProfileRequiredModal 
            userId={user.id} 
            onSuccess={handleProfileComplete} 
          />
        </Dialog>
      )}
      
      {!isIndexPage && <header className="bg-white border-b sticky top-0 z-10">
          <div className="container flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold gradient-text">Growth Portal
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              {user ? <>
                  <Link to="/checklist" className={`font-medium ${isActive('/checklist') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Configurator</Link>
                  <Link to="/configure" className={`font-medium ${isActive('/configure') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Settings</Link>
                  <Link to="/profile" className={`font-medium ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                    Profile
                  </Link>
                </> : <>
                  <Link to="/about" className={`font-medium ${isActive('/about') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                    About
                  </Link>
                  <Link to="/features" className={`font-medium ${isActive('/features') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                    Features
                  </Link>
                </>}
            </nav>
            
            <div className="flex items-center gap-2">
              {user ? <>
                  <span className="hidden md:inline text-sm text-muted-foreground">
                    {user.name}
                  </span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </> : <>
                  <Button size="sm" asChild>
                    <Link to="/">Sign In with SSO</Link>
                  </Button>
                </>}
            </div>
          </div>
        </header>}

      {user && !isIndexPage && <div className="md:hidden bg-muted border-b">
          <div className="container flex justify-between py-2">
            <Link to="/checklist" className={`flex flex-col items-center p-1 ${isActive('/checklist') ? 'text-primary' : 'text-muted-foreground'}`}>
              <Check size={18} />
              <span className="text-xs">Checklist</span>
            </Link>
            <Link to="/configure" className={`flex flex-col items-center p-1 ${isActive('/configure') ? 'text-primary' : 'text-muted-foreground'}`}>
              <Cog size={18} />
              <span className="text-xs">Configure</span>
            </Link>
            <Link to="/profile" className={`flex flex-col items-center p-1 ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`}>
              <User size={18} />
              <span className="text-xs">Profile</span>
            </Link>
          </div>
        </div>}

      <main className={`flex-1 ${!isIndexPage ? 'container py-8' : ''}`}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      {!isIndexPage && <footer className="bg-muted py-6 border-t">
          <div className="container text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} VPP Orchestration Hub. All rights reserved.</p>
          </div>
        </footer>}
    </div>;
}
