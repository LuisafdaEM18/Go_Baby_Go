import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaExclamationTriangle } from 'react-icons/fa';
import Layout from '../Components/Layout'; 
import { getFormularios } from '../services/formularioService';
import { createEvento } from '../services/eventoService';
import { Formulario } from '../services/types';
import { isAdmin } from '../services/authService';

const CrearEventos = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_evento: '',
    lugar: '',
    descripcion: '',
    formulario_pre_evento: '',
    formulario_post_evento: ''
  });
  
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login');
    }
  }, [navigate]);

  // Cargar formularios disponibles
  useEffect(() => {
    const fetchFormularios = async () => {
      try {
        setIsLoading(true);
        const data = await getFormularios();
        setFormularios(data);
      } catch (err: any) {
        console.error('Error al cargar formularios:', err);
        setError('Error al cargar los formularios disponibles.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormularios();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setError('El nombre del evento es obligatorio');
      return;
    }
    if (!formData.fecha_evento) {
      setError('La fecha del evento es obligatoria');
      return;
    }
    
    const fechaEvento = new Date(formData.fecha_evento);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaEvento < hoy) {
      setError('La fecha del evento debe ser posterior a la fecha actual');
      return;
    }
    
    if (!formData.lugar.trim()) {
      setError('La ubicación del evento es obligatoria');
      return;
    }
    
    if (!formData.formulario_pre_evento) {
      setError('El formulario pre-evento es obligatorio');
      return;
    }
    
    if (!formData.formulario_post_evento) {
      setError('El formulario post-evento es obligatorio');
      return;
    }
    
    setError(null);
    setMostrarConfirmacion(true);
  };

  const confirmarCreacion = async () => {
    try {
      setIsSaving(true);
      
      // Crear objeto para enviar al backend
      const eventoData = {
        ...formData,
        formulario_pre_evento: formData.formulario_pre_evento ? parseInt(formData.formulario_pre_evento) : undefined,
        formulario_post_evento: formData.formulario_post_evento ? parseInt(formData.formulario_post_evento) : undefined
      };
      
      await createEvento(eventoData);
      navigate('/eventos/gestionar', { state: { message: 'Evento creado correctamente' } });
    } catch (err: any) {
      console.error('Error al crear evento:', err);
      setError(`Error al crear el evento: ${err.message || 'Error desconocido'}`);
      setMostrarConfirmacion(false);
    } finally {
      setIsSaving(false);
    }
  };

  const cancelarCreacion = () => {
    setMostrarConfirmacion(false);
  };

  return (
    <Layout>
      <div className="flex-1 p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 
            className="text-3xl font-bold text-center mb-8 text-[#1e3766]"
            style={{ fontFamily: "'Recoleta', serif" }}
          >
            Crear Evento
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
              <FaExclamationTriangle className="mr-2" />
              {error}
            </div>
          )}

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
                  value={formData.formulario_pre_evento}
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
                  value={formData.formulario_post_evento}
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
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold flex items-center hover:bg-blue-700"
                disabled={isLoading || isSaving}
              >
                <FaSave className="mr-2" />
                Crear Evento
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal de confirmación */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Confirmar creación</h3>
            <p className="mb-6 text-gray-700">
              ¿Estás seguro de que deseas crear este evento?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelarCreacion}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarCreacion}
                className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Creando...
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

export default CrearEventos;