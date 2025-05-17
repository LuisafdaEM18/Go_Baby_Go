// src/Pages/Eventos.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Eventos: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-blue-900">El Comité</h1>
        <div className="flex items-center space-x-4">
          <span className="text-blue-900 font-medium">Go baby Go</span>
          <div className="text-3xl text-blue-900">
            <FaUserCircle />
          </div>
        </div>
      </div>

      {/* Sidebar flotante izquierdo */}
      <div className="absolute top-1/3 left-4 flex flex-col space-y-4">
        <button className="bg-blue-900 text-white rounded-full p-3 shadow hover:bg-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button className="bg-blue-900 text-white rounded-full p-3 shadow hover:bg-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
          </svg>
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col items-center justify-center flex-1 space-y-6">
        <h2 className="text-3xl font-bold text-blue-900">Eventos</h2>
        <button
          onClick={() => navigate('/eventos/crear')}
          className="bg-blue-900 text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-blue-800 transition"
        >
          Crear
        </button>
        <button
          onClick={() => navigate('/eventos/gestionar')}
          className="bg-blue-900 text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-blue-800 transition"
        >
          Gestionar
        </button>
      </div>
    </div>
  );
};

export default Eventos;
