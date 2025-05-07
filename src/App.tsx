
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MainLayout } from "./components/layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Checklist from "./pages/Checklist";
import Configure from "./pages/Configure";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Configure React Query with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
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
                
                {/* Protected Routes */}
                <Route path="/checklist" element={
                  <ProtectedRoute>
                    <Checklist />
                  </ProtectedRoute>
                } />
                <Route path="/configure" element={
                  <ProtectedRoute>
                    <Configure />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
