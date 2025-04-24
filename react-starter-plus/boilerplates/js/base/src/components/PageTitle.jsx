import React from 'react';
import { Zap } from 'lucide-react';

const PageTitle = () => {
  return (
    <div className="flex flex-col items-center justify-center mb-10">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="text-blue-500" size={28} />
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Vite + React + Zustand
        </h1>
      </div>
      <p className="text-slate-400 text-center max-w-md">
        A modern counter app with state management powered by Zustand
      </p>
    </div>
  );
};

export default PageTitle;