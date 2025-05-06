
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MainLayout } from "./components/layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Checklist from "./pages/Checklist";
import Configure from "./pages/Configure";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { Suspense } from "react";
import { ContentSkeleton } from "./components/transitions/ContentSkeleton";

// Create a new QueryClient with caching options to avoid refetches during navigation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Identify route type to show proper skeleton
const getSkeletonType = (pathname: string) => {
  if (pathname === '/profile') return 'profile';
  if (pathname === '/checklist') return 'configurator';
  if (pathname === '/configure' || pathname === '/dashboard') return 'dashboard';
  return 'default';
};

// Component to handle suspense based on current route
const RouteWithSkeleton = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const skeletonType = getSkeletonType(location.pathname);
  
  return (
    <Suspense fallback={<ContentSkeleton type={skeletonType} />}>
      {children}
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              
              {/* Redirect login/signup to home page with SSO options */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/signup" element={<Navigate to="/" replace />} />
              
              {/* Redirect dashboard to checklist */}
              <Route path="/dashboard" element={<Navigate to="/checklist" replace />} />
              
              {/* Protected Routes with skeletons */}
              <Route path="/checklist" element={
                <ProtectedRoute>
                  <RouteWithSkeleton>
                    <Checklist />
                  </RouteWithSkeleton>
                </ProtectedRoute>
              } />
              <Route path="/configure" element={
                <ProtectedRoute>
                  <RouteWithSkeleton>
                    <Configure />
                  </RouteWithSkeleton>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <RouteWithSkeleton>
                    <Profile />
                  </RouteWithSkeleton>
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
