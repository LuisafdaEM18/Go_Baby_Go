import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaExclamationTriangle, FaSave, FaSpinner } from 'react-icons/fa';
import Layout from '../Components/Layout';

const EditarFormulario = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: '',
    estado: ''
  });

  useEffect(() => {
    if (!id) {
      setError('No se proporcionó ID del formulario');
      setCargando(false);
      return;
    }

    const cargarFormulario = async () => {
      try {
        setCargando(true);
        setError('');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulación de datos del formulario
        const formularioEjemplo = {
          id: 1,
          nombre: 'Encuesta Satisfacción',
          descripcion: 'Formulario para medir satisfacción post-evento',
          tipo: 'post-evento',
          estado: 'activo'
        };

        setFormData({
          nombre: formularioEjemplo.nombre,
          descripcion: formularioEjemplo.descripcion,
          tipo: formularioEjemplo.tipo,
          estado: formularioEjemplo.estado
        });
      } catch (err) {
        setError('Error al cargar el formulario');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarFormulario();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMostrarConfirmacion(true);
  };

  const confirmarActualizacion = async () => {
    try {
      setGuardando(true);
      setError('');
      
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Formulario actualizado:', formData);
      navigate('/formularios/gestionar', { state: { message: 'Formulario actualizado correctamente' } });
    } catch (err) {
      setError('Error al guardar el formulario');
      console.error(err);
    } finally {
      setGuardando(false);
      setMostrarConfirmacion(false);
    }
  };

  const cancelarActualizacion = () => {
    setMostrarConfirmacion(false);
  };

  if (cargando) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Cargando formulario...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-blue-900 mb-2">Editar Formulario</h1>
              <p className="text-gray-600">Modifica la configuración del formulario seleccionado</p>
            </div>

            {error && (
              <div className="mt-6 p-4 text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-center">
                <FaExclamationTriangle className="mr-3 text-red-500" />
                <span className="font-medium">{error}</span>
              </div>
            )}
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Formulario</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Ingresa el nombre del formulario"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    placeholder="Describe el propósito y contenido del formulario"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="pre-evento">Pre-Evento</option>
                      <option value="post-evento">Post-Evento</option>
                      <option value="general">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    >
                      <option value="">Seleccionar estado</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="borrador">Borrador</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate('/formularios/gestionar')}
                    className="form-button-secondary px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="form-button-primary px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
                    disabled={guardando}
                  >
                    <FaSave className="mr-2" />
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de confirmación mejorado */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-gradient-to-br from-white/80 via-blue-50/90 to-gray-100/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSave className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar cambios</h3>
                <p className="text-gray-600">
                  ¿Estás seguro de que deseas guardar los cambios realizados al formulario?
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={cancelarActualizacion}
                  className="form-button-secondary flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200"
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarActualizacion}
                  className="form-button-primary flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
                  disabled={guardando}
                >
                  {guardando ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Confirmar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EditarFormulario;
