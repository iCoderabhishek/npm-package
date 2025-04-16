import path from 'path';
import fs from 'fs-extra';

export async function setupZustand({ projectName, language }) {
  const zustandPath = path.join(process.cwd(), projectName, 'src', 'store');
  await fs.ensureDir(zustandPath);

  const fileName = language === 'ts' ? 'counterStore.ts' : 'counterStore.js';
  const filePath = path.join(zustandPath, fileName);

  const boilerplate = language === 'ts'
    ? `import { create } from 'zustand'

type CounterState = {
  count: number
  increment: () => void
  decrement: () => void
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))

export default useCounterStore
`
    : `import { create } from 'zustand'

const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))

export default useCounterStore
`;

  await fs.writeFile(filePath, boilerplate);
  console.log(`✅ Zustand store created at src/store/${fileName}`);
}
