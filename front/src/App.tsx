import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-gray-800">
        <h1 className="text-3xl font-bold mb-4 text-center">🚀 Tailwind CSS v4</h1>
        <p className="text-gray-600 mb-6 text-center">
          Si ves esta tarjeta con un fondo degradado, bordes redondeados, sombra y texto estilizado...
          entonces <strong className="text-purple-600">Tailwind está funcionando</strong> perfectamente.
        </p>
        <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl">
          ¡Todo listo!
        </button>
      </div>
    </div>
  );
}

export default App;

