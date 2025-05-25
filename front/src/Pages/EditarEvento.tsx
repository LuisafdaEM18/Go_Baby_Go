import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaExclamationTriangle } from 'react-icons/fa';
import Layout from '../Components/Layout';
import { getEventoById, updateEvento } from '../services/eventoService';
import { getFormularios } from '../services/formularioService';
import { Evento, Formulario } from '../services/types';

const EditarEvento = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  
  const [formData, setFormData] = useState<Evento>({
    nombre: '',
    fecha_evento: '',
    lugar: '',
    descripcion: '',
    formulario_pre_evento: undefined,
    formulario_post_evento: undefined
  });

  // Formato de fecha para input date (YYYY-MM-DD)
  const formatFechaInput = (fechaString: string) => {
    const fecha = new Date(fechaString);
    return fecha.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (!id) {
      setError('No se proporcionó ID de evento');
      setCargando(false);
      return;
    }
    
    const cargarDatos = async () => {
      try {
        setCargando(true);
        setError('');
        
        // Cargar evento y formularios en paralelo
        const [eventoData, formulariosData] = await Promise.all([
          getEventoById(parseInt(id)),
          getFormularios()
        ]);
        
        setFormData({
          ...eventoData,
          fecha_evento: formatFechaInput(eventoData.fecha_evento)
        });
        
        setFormularios(formulariosData);
      } catch (err: any) {
        console.error('Error al cargar datos:', err);
        setError(`Error al cargar el evento: ${err.message || 'Error desconocido'}`);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'formulario_pre_evento' || name === 'formulario_post_evento') {
      // Convertir a número o undefined si está vacío
      const numValue = value ? parseInt(value) : undefined;
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMostrarConfirmacion(true);
  };

  const confirmarActualizacion = async () => {
    if (!id) return;
    
    try {
      setGuardando(true);
      setError('');
      
      // Crear copia de los datos para enviar al backend
      const datosParaGuardar: Evento = {
        ...formData
      };
      
      await updateEvento(parseInt(id), datosParaGuardar);
      
      setMostrarConfirmacion(false);
      navigate('/eventos/gestionar', { state: { message: 'Evento actualizado correctamente' } });
    } catch (err: any) {
      console.error('Error al actualizar evento:', err);
      setError(`Error al guardar: ${err.message || 'Error desconocido'}`);
      setMostrarConfirmacion(false);
    } finally {
      setGuardando(false);
    }
  };

  const cancelarActualizacion = () => {
    setMostrarConfirmacion(false);
  };

  if (cargando) {
    return (
      <Layout>
        <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4"></div>
            <p className="text-gray-700">Cargando evento...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-blue-900 mb-6">Editar Evento</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
              <FaExclamationTriangle className="mr-2" />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del Evento</label>
                <input
                  type="date"
                  name="fecha_evento"
                  value={formData.fecha_evento}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                <input
                  type="text"
                  name="lugar"
                  value={formData.lugar}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Formulario Pre-Evento</label>
                  <select
                    name="formulario_pre_evento"
                    value={formData.formulario_pre_evento || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sin formulario pre-evento</option>
                    {formularios.map(form => (
                      <option key={`pre-${form.id}`} value={form.id}>
                        {form.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Formulario Post-Evento</label>
                  <select
                    name="formulario_post_evento"
                    value={formData.formulario_post_evento || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sin formulario post-evento</option>
                    {formularios.map(form => (
                      <option key={`post-${form.id}`} value={form.id}>
                        {form.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/eventos/gestionar')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md font-semibold flex items-center shadow-sm"
                  style={{
                    backgroundColor: '#1e3766',
                    color: 'white',
                    fontFamily: "'Recoleta', serif"
                  }}
                >
                  <FaSave className="mr-2" />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de confirmación */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Confirmar actualización</h3>
            <p className="mb-6 text-gray-700">
              ¿Estás seguro de que deseas guardar los cambios realizados al evento? 
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelarActualizacion}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                disabled={guardando}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarActualizacion}
                className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
                disabled={guardando}
              >
                {guardando ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Guardando...
                  </>
                ) : (
                  'Confirmar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EditarEvento;    