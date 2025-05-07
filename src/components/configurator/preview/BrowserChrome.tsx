
import { ReactNode } from 'react';

interface BrowserChromeProps {
  companyDomain: string;
  children: ReactNode;
}

export const BrowserChrome = ({ companyDomain, children }: BrowserChromeProps) => {
  return (
    <div className="border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden bg-white h-full rounded-none">
      {/* TE-style Browser Chrome */}
      <div className="bg-te-gray-100 p-3 border-b-2 border-black flex items-center">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-te-red"></div>
          <div className="w-3 h-3 rounded-full bg-te-yellow"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 bg-white px-4 py-1 rounded-none text-xs text-black text-center font-mono sidebar-browser-domain border-2 border-black">
          {companyDomain}/products
        </div>
      </div>
      
      {/* Browser Content */}
      <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
        {children}
      </div>
    </div>
  );
};
