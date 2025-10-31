
import React from 'react';
import { LogoIcon, MenuIcon, UserGroupIcon } from './icons';

export const InfoPanel: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col w-1/3 bg-sheetify-purple text-white p-8 rounded-r-2xl">
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center space-x-2">
           <LogoIcon />
           <span className="font-bold text-lg">SHEETIFY CRM</span>
        </div>
        <div className="flex items-center space-x-4">
          <UserGroupIcon />
          <MenuIcon />
        </div>
      </header>
      <div className="flex flex-col items-center text-center flex-grow">
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Zack</h2>
          <p className="text-sm text-gray-300">(Sheetify Customer Support Specialist)</p>
        </div>
        <div className="mt-auto h-1/2 w-full flex items-end justify-center">
            <img 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=600&auto=format&fit=crop"
                alt="Zack, AI Support Agent" 
                className="h-full w-auto object-cover object-top"
            />
        </div>
      </div>
    </div>
  );
};
