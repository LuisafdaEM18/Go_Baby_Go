import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaExclamationTriangle } from 'react-icons/fa';
import Layout from '../Components/Layout';

const EditarEvento = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: '',
    ubicacion: '',
    formularioPre: '',
    formularioPost: '',
    estado: ''
  });

  const formatFechaInput = (fecha: string) => {
    const [dia, mes, anio] = fecha.split('-');
    return `${anio}-${mes}-${dia}`;
  };

  const formatFechaDisplay = (fecha: string) => {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}-${mes}-${anio}`;
  };

  useEffect(() => {
        console.log('ID recibido:', id); 
        if (!id) {
            setError('No se proporcionó ID de evento');
            setCargando(false);
            return;
        }
    const cargarEvento = async () => {
      try {
        setCargando(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const eventoEjemplo = {
          id: 1,
          nombre: 'Go baby go',
          fecha: '15-11-2023', 
          ubicacion: 'UdeM',
          formularioPre: 'evaluacion',
          formularioPost: 'satisfaccion',
          estado: 'completado'
        };

        {
          setFormData({
            nombre: eventoEjemplo.nombre,
            fecha: formatFechaInput(eventoEjemplo.fecha), 
            ubicacion: eventoEjemplo.ubicacion,
            formularioPre: eventoEjemplo.formularioPre,
            formularioPost: eventoEjemplo.formularioPost,
            estado: eventoEjemplo.estado
          });
        } 
      } catch (err) {
        setError('Error al cargar el evento');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarEvento();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMostrarConfirmacion(true);
  };

  const confirmarActualizacion = () => {
    const datosParaGuardar = {
      ...formData,
      fecha: formatFechaDisplay(formData.fecha)
    };
    
    console.log('Evento actualizado:', datosParaGuardar);
    navigate('/eventos');
  };

  const cancelarActualizacion = () => {
    setMostrarConfirmacion(false);
  };

  if (cargando) {
    return (
      <Layout>
        <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
          <div className="text-center">Cargando evento...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 p-6 overflow-y-auto">
      <h1 style={{ fontSize: '16px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>Editar Evento</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha (DD-MM-AAAA)</label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccionar estado</option>
                <option value="activo">Activo</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
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
                onClick={() => navigate('/eventos/gestionar')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <FaSave className="mr-2" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </form>
      </div>

      {mostrarConfirmacion && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-start mb-4">
              <FaExclamationTriangle className="text-yellow-500 text-2xl mr-3 mt-1" />
              <h3 className="text-lg font-medium">Confirmar cambios</h3>
            </div>
            <p className="mb-6">¿Estás seguro que deseas guardar los cambios realizados a este evento?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelarActualizacion}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarActualizacion}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <FaSave className="mr-2" />
                Confirmar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EditarEvento;    