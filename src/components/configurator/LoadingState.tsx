
import React from 'react';

export const LoadingState = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <p className="text-muted-foreground">Loading your configuration...</p>
      </div>
    </div>
  );
};
