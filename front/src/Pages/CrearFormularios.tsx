import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaSave, FaPlus, FaTimes } from 'react-icons/fa';
import Layout from '../Components/Layout';

const FormularioCrear: React.FC = () => {
  const navigate = useNavigate();

  const [preguntas, setPreguntas] = useState<
    { pregunta: string; tipo: 'texto' | 'opciones'; opciones?: string[] }[]
  >([]);

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const agregarPregunta = () => {
    setPreguntas([...preguntas, { pregunta: '', tipo: 'texto' }]);
  };

  const eliminarPregunta = (index: number) => {
    const nuevas = preguntas.filter((_, i) => i !== index);
    setPreguntas(nuevas);
  };

  const actualizarPregunta = (index: number, campo: string, valor: string) => {
    const nuevas = [...preguntas];
    if (campo === 'tipo') {
      nuevas[index].tipo = valor as 'texto' | 'opciones';
      if (valor === 'opciones') {
        nuevas[index].opciones = [''];
      } else {
        delete nuevas[index].opciones;
      }
    } else {
      nuevas[index].pregunta = valor;
    }
    setPreguntas(nuevas);
  };

  const actualizarOpcion = (index: number, opcionIndex: number, valor: string) => {
    const nuevas = [...preguntas];
    if (nuevas[index].opciones) {
      nuevas[index].opciones![opcionIndex] = valor;
      setPreguntas(nuevas);
    }
  };

  const agregarOpcion = (index: number) => {
    const nuevas = [...preguntas];
    nuevas[index].opciones?.push('');
    setPreguntas(nuevas);
  };

  const eliminarOpcion = (preguntaIndex: number, opcionIndex: number) => {
    const nuevas = [...preguntas];
    if (nuevas[preguntaIndex].opciones && nuevas[preguntaIndex].opciones!.length > 1) {
      nuevas[preguntaIndex].opciones = nuevas[preguntaIndex].opciones!.filter((_, i) => i !== opcionIndex);
      setPreguntas(nuevas);
    }
  };

  const handleCrearClick = (e: React.FormEvent) => {
    e.preventDefault();
    setMostrarConfirmacion(true);
  };

  const confirmarCrear = () => {
    setMostrarConfirmacion(false);
    navigate('/formularios');
  };

  const cancelarCrear = () => {
    setMostrarConfirmacion(false);
  };

  return (
    <Layout>
     <div className="min-h-screen py-8 px-4 bg-white">
        <form 
          className="max-w-3xl mx-auto space-y-6 p-6 shadow-lg rounded-lg bg-white"
          style={{ fontFamily: "'Avenir', sans-serif" }}
        >
          <h2 
            className="text-3xl font-bold text-center mb-8 text-[#1e3766]"
            style={{ fontFamily: "'Recoleta', serif" }}
          >
            Crear Formulario
          </h2>

          <div className="space-y-6">
            {['Nombre', 'Apellido', 'Correo electrónico', 'Número de identificación'].map(
              (campo, idx) => (
                <div key={idx} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">{campo}</label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                    />
                  </div>
                </div>
              )
            )}
          </div>

          <div className="space-y-6 mt-8">
            {preguntas.map((preg, idx) => (
              <div key={idx} className="border border-gray-200 p-4 rounded-lg bg-blue-50 space-y-3 relative">
                <div className="flex justify-between items-start">
                  <input
                    type="text"
                    placeholder="Escribe tu pregunta"
                    value={preg.pregunta}
                    onChange={(e) => actualizarPregunta(idx, 'pregunta', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => eliminarPregunta(idx)}
                    className="ml-2 p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full"
                    aria-label="Eliminar pregunta"
                    title="Eliminar pregunta"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>

                <select
                  value={preg.tipo}
                  onChange={(e) => actualizarPregunta(idx, 'tipo', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="texto">Respuesta de texto</option>
                  <option value="opciones">Opción múltiple</option>
                </select>

                {preg.tipo === 'opciones' && preg.opciones && (
  <div className="space-y-2">
    {preg.opciones.map((op, i) => (
      <div key={i} className="flex items-center">
        <input
          type="text"
          placeholder={`Opción ${i + 1}`}
          value={op}
          onChange={(e) => actualizarOpcion(idx, i, e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {preg.opciones && preg.opciones.length > 1 && (
          <button
            type="button"
            onClick={() => eliminarOpcion(idx, i)}
            className="ml-2 p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full"
            aria-label="Eliminar opción"
            title="Eliminar opción"
          >
            <FaTimes className="text-sm" />
          </button>
        )}
      </div>
    ))}
    <button
      type="button"
      onClick={() => agregarOpcion(idx)}
      className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
    >
      <FaPlus className="mr-1" />
      Agregar opción
    
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={agregarPregunta}
            className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            style={{ fontFamily: "'Avenir', sans-serif", fontWeight: 600 }}
          >
            <FaPlus className="mr-2" />
            Agregar nueva pregunta
          </button>

          <div className="flex items-center mt-8">
            <input 
              type="checkbox" 
              required 
              id="terminos"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terminos" className="ml-2 block text-sm text-gray-700">
              Acepto los términos y condiciones
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-8">
            <button
              type="button"
              onClick={() => navigate('/formularios')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              style={{ fontFamily: "'Avenir', sans-serif", fontWeight: 600 }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleCrearClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              style={{ fontFamily: "'Avenir', sans-serif", fontWeight: 600 }}
            >
              <FaSave className="mr-2" />
              Crear formulario
            </button>
          </div>
        </form>

        {mostrarConfirmacion && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div 
              className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
              style={{ fontFamily: "'Avenir', sans-serif" }}
            >
              <div className="flex items-start mb-4">
                <FaExclamationTriangle className="text-yellow-500 text-2xl mr-3 mt-1" />
                <h3 
                  className="text-lg font-medium text-gray-900"
                  style={{ fontFamily: "'Recoleta', serif" }}
                >
                  Confirmar creación
                </h3>
              </div>
              <p className="mb-6 text-gray-700">¿Estás seguro que deseas crear este formulario?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelarCrear}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  style={{ fontFamily: "'Avenir', sans-serif", fontWeight: 600 }}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarCrear}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  style={{ fontFamily: "'Avenir', sans-serif", fontWeight: 600 }}
                >
                  <FaSave className="mr-2" />
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FormularioCrear;




