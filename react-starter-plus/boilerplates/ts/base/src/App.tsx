import React from "react";
import { useCounterStore } from "./store/counterStore";

function App() {
  const count = useCounterStore((state: any) => state.count);
  const increment = useCounterStore((state: any) => state.increment);

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
