
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Check, Cog, List, User } from 'lucide-react';

export function MainLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Hide header and footer on index page
  const isIndexPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      {!isIndexPage && (
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="container flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold gradient-text">
              VPP Orchestration Hub
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`font-medium ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/checklist" 
                    className={`font-medium ${isActive('/checklist') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Setup Checklist
                  </Link>
                  <Link 
                    to="/configure" 
                    className={`font-medium ${isActive('/configure') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Configure
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/about" 
                    className={`font-medium ${isActive('/about') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    About
                  </Link>
                  <Link 
                    to="/features" 
                    className={`font-medium ${isActive('/features') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Features
                  </Link>
                </>
              )}
            </nav>
            
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <span className="hidden md:inline text-sm text-muted-foreground">
                    {user.name}
                  </span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" asChild>
                    <Link to="/">Sign In with SSO</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>
      )}

      {user && !isIndexPage && (
        <div className="md:hidden bg-muted border-b">
          <div className="container flex justify-between py-2">
            <Link 
              to="/dashboard" 
              className={`flex flex-col items-center p-1 ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <List size={18} />
              <span className="text-xs">Dashboard</span>
            </Link>
            <Link 
              to="/checklist" 
              className={`flex flex-col items-center p-1 ${isActive('/checklist') ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Check size={18} />
              <span className="text-xs">Checklist</span>
            </Link>
            <Link 
              to="/configure" 
              className={`flex flex-col items-center p-1 ${isActive('/configure') ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Cog size={18} />
              <span className="text-xs">Configure</span>
            </Link>
            <Link 
              to="/profile" 
              className={`flex flex-col items-center p-1 ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <User size={18} />
              <span className="text-xs">Profile</span>
            </Link>
          </div>
        </div>
      )}

      <main className={`flex-1 ${!isIndexPage ? 'container py-8' : ''}`}>
        <Outlet />
      </main>

      {!isIndexPage && (
        <footer className="bg-muted py-6 border-t">
          <div className="container text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} VPP Orchestration Hub. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
}
