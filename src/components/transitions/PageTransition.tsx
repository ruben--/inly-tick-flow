
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');
  const contentRef = useRef<HTMLDivElement>(null);
  const previousHeightRef = useRef<number>(0);
  const [isContentReady, setIsContentReady] = useState(true);

  // Handle location changes
  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      // Capture the current height before transition
      if (contentRef.current) {
        previousHeightRef.current = contentRef.current.offsetHeight;
      }
      
      // Set page as not ready during transition
      setIsContentReady(false);
      
      // Start fade out
      setTransitionStage('fadeOut');
      
      // Give enough time for the fade out to complete
      const timeout = setTimeout(() => {
        // Update location
        setDisplayLocation(location);
        
        // Add a slight delay before showing the new content
        // This gives components time to initialize
        setTimeout(() => {
          setTransitionStage('fadeIn');
          setIsContentReady(true);
        }, 50);
      }, 300); // Match with CSS transition duration
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  return (
    <div 
      className="transition-container"
      style={{
        minHeight: previousHeightRef.current > 0 ? `${previousHeightRef.current}px` : undefined
      }}
    >
      <div 
        ref={contentRef}
        className={`transition-wrapper ${transitionStage} ${!isContentReady && transitionStage === 'fadeIn' ? 'content-loading' : ''}`}
      >
        {children}
      </div>
    </div>
  );
};
