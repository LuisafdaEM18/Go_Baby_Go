import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';
import Layout from '../Components/Layout'; 

const CrearEventos = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: '',
    ubicacion: '',
    formularioPre: '',
    formularioPost: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Evento creado:', formData);
    navigate('/eventos');
  };

  return (
    <Layout>
      <div className="flex-1 p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-blue-900 mb-6"></h1>
           <h2 
            className="text-3xl font-bold text-center mb-8 text-[#1e3766]"
            style={{ fontFamily: "'Recoleta', serif" }}
          >
            Crear Evento
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Evento</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <input
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Formulario Pre-Evento</label>
                <select
                  name="formularioPre"
                  value={formData.formularioPre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="evaluacion">Evaluación Inicial</option>
                  <option value="registro">Registro Participantes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Formulario Post-Evento</label>
                <select
                  name="formularioPost"
                  value={formData.formularioPost}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="satisfaccion">Encuesta Satisfacción</option>
                  <option value="reporte">Reporte Final</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-2 rounded-md font-semibold shadow transition"
                style={{
                  backgroundColor: '#1e3766',
                  color: 'white',
                  fontFamily: "'Recoleta', serif"
                }}
              
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-2 rounded-md font-semibold shadow transition"
                style={{
                  backgroundColor: '#1e3766',
                  color: 'white',
                  fontFamily: "'Recoleta', serif"
                }}
              >
                <FaSave className="mr-2" />
                Guardar Evento
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CrearEventos;