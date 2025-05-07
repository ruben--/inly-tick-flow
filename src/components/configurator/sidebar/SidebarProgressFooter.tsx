
import { ReactNode } from 'react';

interface SidebarProgressFooterProps {
  progressPercentage: number;
  completedCount: number;
  totalCount: number;
  className?: string;
  children?: ReactNode;
}

export const SidebarProgressFooter = ({ 
  progressPercentage,
  completedCount,
  totalCount,
  className = '',
  children 
}: SidebarProgressFooterProps) => {
  return (
    <div className={`p-4 border-t-2 border-black bg-white ${className}`}>
      <div className="text-xs text-black uppercase tracking-wider font-bold mb-2">Progress</div>
      <div className="w-full bg-te-gray-200 h-2 rounded-none overflow-hidden border border-black">
        <div 
          className="bg-te-orange h-full rounded-none transition-all duration-500 ease-in-out"
          style={{
            width: `${progressPercentage}%`
          }}
        ></div>
      </div>
      <div className="text-xs text-black mt-2 text-right font-mono">
        {completedCount} of {totalCount} complete
      </div>
      {children}
    </div>
  );
};
