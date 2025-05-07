
import React from "react";

export const ProfileLoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="animate-pulse h-20 w-20 bg-gray-200 rounded-full"></div>
      <div className="animate-pulse h-4 w-48 bg-gray-200 rounded"></div>
      <div className="animate-pulse h-4 w-36 bg-gray-200 rounded"></div>
    </div>
  );
};
