import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout'; 

const Eventos: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen space-y-10">
        <h2 className="text-6xl font-bold text-blue-900">Eventos</h2>
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
    </Layout>
  );
};

export default Eventos;