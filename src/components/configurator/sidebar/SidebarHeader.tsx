
import { ReactNode } from 'react';

interface SidebarHeaderProps {
  title: string;
  className?: string;
  children?: ReactNode;
}

export const SidebarHeader = ({ title, className = '', children }: SidebarHeaderProps) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="h-8 bg-white shadow-none"></div>
      <div className="flex justify-between items-center py-4 border-b-2 border-black px-4 bg-black">
        <h3 className="font-mono text-white text-lg uppercase tracking-wide">{title}</h3>
        {children}
      </div>
    </div>
  );
};
