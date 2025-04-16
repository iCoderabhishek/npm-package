import React from 'react'
import useCounterStore from './store/counterStore'

function App() {
  const { count, increment, decrement } = useCounterStore()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Zustand Counter (JS)</h1>
      <p className="text-xl mb-2">Count: {count}</p>
      <div className="space-x-4">
        <button onClick={increment} className="px-4 py-2 bg-green-500 text-white rounded">+</button>
        <button onClick={decrement} className="px-4 py-2 bg-red-500 text-white rounded">-</button>
      </div>
    </div>
  )
}

export default App
