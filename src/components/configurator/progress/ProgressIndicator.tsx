
import { useState, useEffect } from 'react';

interface ProgressIndicatorProps {
  progress: number;
  completedTasks: number;
  totalTasks: number;
}

export const ProgressIndicator = ({ progress, completedTasks, totalTasks }: ProgressIndicatorProps) => {
  return (
    <>
      <div className="flex justify-between text-xs">
        <span>{progress}% Complete</span>
        <span className="text-te-gray-600">
          {completedTasks} of {totalTasks} tasks completed
        </span>
      </div>
      <div className="w-full bg-te-gray-200 h-2 rounded-none overflow-hidden border border-black">
        <div 
          className="bg-te-orange h-full rounded-none transition-all duration-500 ease-in-out"
          style={{
            width: `${progress}%`
          }}
        ></div>
      </div>
    </>
  );
};
