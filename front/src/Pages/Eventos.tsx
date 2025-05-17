import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout';

const Eventos: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div
        className="flex flex-col items-center justify-center w-full h-full space-y-10"
        style={{
          backgroundColor: 'white',
          fontFamily: "'Recoleta', serif",
          color: '#1e3766'
        }}
      >
        <h2 className="text-6xl font-bold">Eventos</h2>
        <button
          onClick={() => navigate('/eventos/crear')}
          className="px-6 py-2 rounded-md font-semibold shadow transition"
          style={{
            backgroundColor: '#1e3766',
            color: 'white',
            fontFamily: "'Recoleta', serif"
          }}
        >
          Crear
        </button>
        <button
          onClick={() => navigate('/eventos/gestionar')}
          className="px-6 py-2 rounded-md font-semibold shadow transition"
          style={{
            backgroundColor: '#1e3766',
            color: 'white',
            fontFamily: "'Recoleta', serif"
          }}
        >
          Gestionar
        </button>
      </div>
    </Layout>
  );
};

export default Eventos;
