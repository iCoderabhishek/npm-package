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
}

export const useCounterStore = create<State>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
`
      : `import { create } from 'zustand';

export const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
`;

    await fs.writeFile(filePath, boilerplate);

const zustandAppTemplate =
  language === 'ts'
    ? `import React from 'react';
import { useCounterStore } from "./store/counterStore";

interface State {
  count: number;
  increment: () => void;
}

function App() {
  const count = useCounterStore((state: State) => state.count);
  const increment = useCounterStore((state: State) => state.increment);

  return (
    <>
      <h1>Vite + React + Zustand</h1>
      <div className="card">
        <button onClick={increment}>count is {count}</button>
      </div>
    </>
  );
}

export default App;
`
    : `import React from 'react';
import { useCounterStore } from "./store/counterStore";

function App() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);

  return (
    <>
      <h1>Vite + React + Zustand</h1>
      <div className="card">
        <button onClick={increment}>count is {count}</button>
      </div>
    </>
  );
}

export default App;
`;


    await fs.writeFile(appPath, zustandAppTemplate);

    try {
      await execPromise('npm install zustand', {
        cwd: path.join(process.cwd(), projectName),
      });
      console.log('✅ Zustand installed successfully');
    } catch (error) {
      console.error('❌ Error installing Zustand:', error);
    }
  } else {
    const useStateTemplate = `
    import React, { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count + 1)}>count is {count}</button>
      </div>
    </>
  );
}

export default App;
`;

    await fs.writeFile(appPath, useStateTemplate);
  }
}
