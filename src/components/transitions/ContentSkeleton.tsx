
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface ContentSkeletonProps {
  type?: 'profile' | 'configurator' | 'dashboard' | 'default';
}

export const ContentSkeleton = ({ type = 'default' }: ContentSkeletonProps) => {
  if (type === 'configurator') {
    return (
      <div className="space-y-6">
        {/* Progress skeleton */}
        <div className="w-full h-16 mb-8">
          <Skeleton className="w-full h-full" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar skeleton */}
          <div className="md:w-1/3 lg:w-1/4 space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          
          {/* Main content skeleton */}
          <div className="md:w-2/3 lg:w-3/4">
            <Skeleton className="h-[600px] w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (type === 'profile') {
    return (
      <div className="container py-8 max-w-3xl mx-auto">
        <div className="border rounded-md p-6">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (type === 'dashboard') {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }
  
  // Default skeleton
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
};
