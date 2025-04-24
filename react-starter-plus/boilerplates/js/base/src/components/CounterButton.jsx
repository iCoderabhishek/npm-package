import React from 'react';
import { PlusCircle } from 'lucide-react';



const CounterButton = ({ count, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex items-center justify-center gap-2 bg-white/10 backdrop-blur-lg rounded-lg px-6 py-3 text-white font-medium transition-all duration-300 overflow-hidden hover:bg-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-white/10"
    >
      <span>Count is {count}</span>
      <PlusCircle className="transition-transform group-hover:rotate-90" size={20} />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-blue-600/20 group-hover:to-blue-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
    </button>
  );
};

export default CounterButton;