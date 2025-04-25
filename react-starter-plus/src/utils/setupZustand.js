import path from 'path';
import fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);



export async function setupZustand({ projectName, language, includeZustand }) {
  const ext = language === 'ts' ? 'tsx' : 'jsx';
  const appPath = path.join(process.cwd(), projectName, 'src', `App.${ext}`);

  if (includeZustand) {
    const zustandPath = path.join(process.cwd(), projectName, 'src', 'store');
    await fs.ensureDir(zustandPath);

    const fileName = language === 'ts' ? 'counterStore.ts' : 'counterStore.js';
    const filePath = path.join(zustandPath, fileName);

    // Zustand store setup with explicit type
    const boilerplate = language === 'ts'
      ? `import { create } from 'zustand';

interface State {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<State>((set) => ({
  count: 0,
  increment: () => set((state: State) => ({ count: state.count + 1 })),
  decrement: () => set((state: State) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

`
      : `import { create } from 'zustand';



export const useCounterStore = create<State>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));`;

    await fs.writeFile(filePath, boilerplate);

const zustandAppTemplate =
  language === 'ts'
    ? `import React, { useState } from 'react';
  import { useCounterStore } from './store/counterStore';

 interface State {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

  const App = () => {
  const count = useCounterStore((state: State) => state.count);
  const increment = useCounterStore((state: State) => state.increment);
  const decrement = useCounterStore((state: State) => state.decrement);
  const reset = useCounterStore((state: State) => state.reset);
    
  const [isHovering, setIsHovering] = useState(false);

  return (
    <header className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-950 dark:text-white p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="flex flex-wrap items-center justify-center text-4xl md:text-6xl font-bold mb-8 dark:bg-white p-4 bg-gradient-to-r from-sky-100 to-neutral-400 bg-clip-text text-transparent gap-2 md:gap-6">
          <div className="flex items-center">
            <a href="https://vite.dev" target="_blank">Vite</a>
          </div>
          <span className="font-semibold">+</span>
          <div className="flex items-center">
            <a href="https://react.dev" target="_blank">React</a>
          </div>
          <span className="font-semibold">+</span>
          <div className="flex items-center">
            <a href="https://tailwindcss.com/" target="_blank">Tailwind</a>
          </div>
        </h1>

        <div
  className={\`relative rounded-2xl mb-10 transition-all duration-300 \${isHovering ? 'scale-105 shadow-[0_0_40px_#818cf8]' : ''}\`}
  onMouseEnter={() => setIsHovering(true)}
  onMouseLeave={() => setIsHovering(false)}
>

          <button
            onClick={increment}
            className=" hover:cursor-pointer group relative flex items-center justify-center px-14 py-8 text-3xl font-medium text-white bg-[#101028cc] rounded-2xl border border-[#272757] transition-transform duration-300"
          >
            <span className="relative z-10 drop-shadow-sm">Count is {count}</span>
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl pointer-events-none">
              <div className="absolute inset-0 bg-[#0f0f0f]/30 rounded-2xl" />
              <div className="absolute inset-0 bg-[#1a1a40]/30 rounded-2xl mix-blend-overlay" />
              <div className="absolute inset-0 bg-[#f409446e] rounded-2xl mix-blend-overlay" />
            </div>
          </button>
        </div>

        <div className="mb-10 font-sans font-medium flex gap-4 w-full justify-center">
          {/* These won’t work unless you expand Zustand store. Optional */}
          <button
            onClick={decrement}
            className="px-6 py-3 bg-[#1a1a4065] hover:bg-gray-700 rounded-xl border border-gray-700 w-1/3"
          >
            Decrement
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#1d1d4edc] hover:bg-gray-700 rounded-xl border border-gray-700 w-1/3"
          >
            Reset
          </button>
        </div>

        <p className="mb-3 text-white">Edit src/App.tsx and save to test HMR</p>
        <p className="text-sm mb-2 text-neutral-50">
          For more info about setup, consider{' '}
          <a
            href="https://vite.dev/guide/"
            className="hover:underline hover:text-red-100"
          >
            Vite Documentation ↗
          </a>
        </p>

        <p className="text-sm">
          made with <span className="text-red-400">ꨄ</span>{' '}
          <a className="font-semibold">react-starter-plus</a>
        </p>
      </div>
    </header>
  );
};

export default App;


`
    : `import React, { useState } from 'react';
import { useCounterStore } from './store/counterStore';

const App = () => {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

  const [isHovering, setIsHovering] = useState(false);

  return (
    <header className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-950 dark:text-white p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="flex flex-wrap items-center justify-center text-4xl md:text-6xl font-bold mb-8 dark:bg-white p-4 bg-gradient-to-r from-sky-100 to-neutral-400 bg-clip-text text-transparent gap-2 md:gap-6">
          <div className="flex items-center">
            <a href="https://vite.dev" target="_blank">Vite</a>
          </div>
          <span className="font-semibold">+</span>
          <div className="flex items-center">
            <a href="https://react.dev" target="_blank">React</a>
          </div>
          <span className="font-semibold">+</span>
          <div className="flex items-center">
            <a href="https://tailwindcss.com/" target="_blank">Tailwind</a>
          </div>
        </h1>

        <div
  className={\`relative rounded-2xl mb-10 transition-all duration-300 \${isHovering ? 'scale-105 shadow-[0_0_40px_#818cf8]' : ''}\`}
  onMouseEnter={() => setIsHovering(true)}
  onMouseLeave={() => setIsHovering(false)}
>

          <button
            onClick={increment}
            className=" hover:cursor-pointer group relative flex items-center justify-center px-14 py-8 text-3xl font-medium text-white bg-[#101028cc] rounded-2xl border border-[#272757] transition-transform duration-300"
          >
            <span className="relative z-10 drop-shadow-sm">Count is {count}</span>
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl pointer-events-none">
              <div className="absolute inset-0 bg-[#0f0f0f]/30 rounded-2xl" />
              <div className="absolute inset-0 bg-[#1a1a40]/30 rounded-2xl mix-blend-overlay" />
              <div className="absolute inset-0 bg-[#f409446e] rounded-2xl mix-blend-overlay" />
            </div>
          </button>
        </div>

        <div className="mb-10 font-sans font-medium flex gap-4 w-full justify-center">
          {/* These won’t work unless you expand Zustand store. Optional */}
          <button
            onClick={decrement}
            className="px-6 py-3 bg-[#1a1a4065] hover:bg-gray-700 rounded-xl border border-gray-700 w-1/3"
          >
            Decrement
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#1d1d4edc] hover:bg-gray-700 rounded-xl border border-gray-700 w-1/3"
          >
            Reset
          </button>
        </div>

        <p className="mb-3 text-white">Edit src/App.tsx and save to test HMR</p>
        <p className="text-sm mb-2 text-neutral-50">
          For more info about setup, consider{' '}
          <a
            href="https://vite.dev/guide/"
            className="hover:underline hover:text-red-100"
          >
            Vite Documentation ↗
          </a>
        </p>

        <p className="text-sm">
          made with <span className="text-red-400">ꨄ</span>{' '}
          <a className="font-semibold">react-starter-plus</a>
        </p>
      </div>
    </header>
  );
};

export default App;

`;


    await fs.writeFile(appPath, zustandAppTemplate);

    try {
      await execPromise('npm install zustand', {
        cwd: path.join(process.cwd(), projectName),
      });
      console.log('\n ✔ Zustand installed successfully');
    } catch (error) {
      console.error('✗ Error installing Zustand:', error);
    }
  } else {
    const useStateTemplate = `
   import React, { useState } from 'react';
   
   const App = () => {
     const [count, setCount] = useState(0);
     const [isHovering, setIsHovering] = useState(false);
   
     return (
       <header className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-950 dark:text-white p-4">
         <div className="w-full max-w-md flex flex-col items-center">
           <h1 className="flex flex-wrap items-center justify-center text-4xl md:text-6xl font-bold mb-8 dark:bg-white p-4 bg-gradient-to-r from-sky-100 to-neutral-400 bg-clip-text text-transparent gap-2 md:gap-6">
             <div className="flex items-center">
               <a href="https://vite.dev" target="_blank">
                 Vite
               </a>
             </div>
             <span className="font-semibold">+</span>
             <div className="flex items-center">
               <a href="https://react.dev" target="_blank">
                 React
               </a>
             </div>
             <span className="font-semibold">+</span>
             <div className="flex items-center">
               <a href="https://tailwindcss.com/" target="_blank">
                 Tailwind
               </a>
             </div>
           </h1>
   
          <div
  className={\`relative rounded-2xl mb-10 transition-all duration-300 \${isHovering ? 'scale-105 shadow-[0_0_40px_#818cf8]' : ''}\`}
  onMouseEnter={() => setIsHovering(true)}
  onMouseLeave={() => setIsHovering(false)}
>

             <button
               onClick={() => setCount((c) => c + 1)}
               className=" hover:cursor-pointer group relative flex items-center justify-center px-14 py-8 text-3xl font-medium text-white bg-[#101028cc] rounded-2xl border border-[#272757] transition-transform duration-300"
             >
               <span className="relative z-10 drop-shadow-sm">
                 Count is {count}
               </span>
   
               {/* 🔥 Multi-Layered Hover Glow with Your Colors */}
               <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl pointer-events-none">
                 <div className="absolute inset-0 bg-[#0f0f0f]/30 rounded-2xl" />
                 <div className="absolute inset-0 bg-[#1a1a40]/30 rounded-2xl mix-blend-overlay" />
                 <div className="absolute inset-0 bg-[#f409446e] rounded-2xl mix-blend-overlay" />
               </div>
             </button>
           </div>
   
           <div className="mb-10 font-sans font-medium flex gap-4 w-full justify-center">
             <button
               onClick={() => setCount((c) => Math.max(0, c - 1))}
               className="px-6 py-3 bg-[#1a1a4065] hover:bg-gray-700 rounded-xl border border-gray-700 w-1/3"
             >
               Decrement
             </button>
             <button
               onClick={() => setCount(0)}
               className="px-6 py-3 bg-[#1d1d4edc] hover:bg-gray-700 rounded-xl border border-gray-700 w-1/3"
             >
               Reset
             </button>
           </div>
   
           <p className="mb-3 text-white">Edit src/App.jsx and save to test HMR</p>
           <p className="text-sm mb-2 text-neutral-50">
             For more info about setup, consider{' '}
             <a
               href="https://vite.dev/guide/"
               className="hover:underline hover:text-red-100"
             >
               Vite Documentation ↗
             </a>
           </p>
   
           <p className="text-sm">
             made with <span className="text-red-400">ꨄ</span>{' '}
             <a className="font-semibold">react-starter-plus</a>
           </p>
         </div>
       </header>
     );
   };
   
   export default App;
   
  `;

    await fs.writeFile(appPath, useStateTemplate);
  }
}
