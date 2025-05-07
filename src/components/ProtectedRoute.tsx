
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogoProvider } from '@/contexts/LogoContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login and remember where they were trying to go
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return (
    <LogoProvider userId={user.id}>
      {children}
    </LogoProvider>
  );
}
