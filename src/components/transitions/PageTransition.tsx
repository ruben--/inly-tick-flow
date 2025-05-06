
import React from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  
  // Simple wrapper with no transition effects
  return (
    <div className="page-content">
      {children}
    </div>
  );
};
