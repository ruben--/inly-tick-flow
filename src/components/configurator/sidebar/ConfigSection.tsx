
import { ReactNode } from 'react';

interface ConfigSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

export const ConfigSection = ({ title, icon, children }: ConfigSectionProps) => {
  return (
    <div className="border-none">
      <div className="w-full flex items-center justify-between p-3 rounded-none text-left bg-te-orange border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center">
          {icon}
          <span className="text-black font-mono uppercase tracking-wider text-xs">{title}</span>
        </div>
      </div>
      <div className="pt-3 pb-0">
        <div className="ml-3 space-y-3 bg-white p-3 rounded-none border-2 border-black">
          {children}
        </div>
      </div>
    </div>
  );
};
