
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { 
  useUser, 
  useAuth as useClerkAuth, 
  useSignIn,
  useClerk
} from '@clerk/clerk-react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithSSO: (provider: 'google' | 'microsoft') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoaded: clerkLoaded, user: clerkUser } = useUser();
  const { signIn } = useSignIn();
  const { isLoaded } = useClerkAuth();
  const clerk = useClerk();

  // Transform Clerk User to our User interface
  const user: User | null = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    name: clerkUser.firstName || clerkUser.username || 'User',
  } : null;

  // SSO login function
  const loginWithSSO = async (provider: 'google' | 'microsoft') => {
    try {
      // Map our provider names to Clerk's OAuth provider names
      const strategy = 
        provider === 'microsoft' ? 'oauth_microsoft' : 'oauth_google';
        
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: `${window.location.origin}/dashboard`,
        redirectUrlComplete: `${window.location.origin}/dashboard`,
      });
    } catch (error) {
      console.error('SSO login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await clerk.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading: !isLoaded, 
        loginWithSSO, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
