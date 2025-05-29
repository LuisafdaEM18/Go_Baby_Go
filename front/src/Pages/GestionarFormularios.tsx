import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaExclamationCircle, FaCheck, FaSpinner, FaFilter, FaEye, FaTimes, FaQuestionCircle, FaClipboardList } from 'react-icons/fa';
import Layout from '../Components/Layout';
import { getFormularios, deleteFormulario } from '../services/formularioService';
import { Formulario } from '../services/types';
import { isAdmin } from '../services/authService';
import { useNotification } from '../context/NotificationContext';

const GestionarFormularios = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const [formulariosOriginales, setFormulariosOriginales] = useState<Formulario[]>([]);
  const [formulariosFiltrados, setFormulariosFiltrados] = useState<Formulario[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [formularioAEliminar, setFormularioAEliminar] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    location.state?.message || null
  );
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');

  // Estados para vista previa
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
  const [formularioVistaPrevia, setFormularioVistaPrevia] = useState<Formulario | null>(null);

  // Verificar autenticación
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login');
    }
  }, [navigate]);

  // Cargar formularios
  useEffect(() => {
    const fetchFormularios = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getFormularios();
        setFormulariosOriginales(data);
        setFormulariosFiltrados(data);
      } catch (err: any) {
        console.error('Error al cargar formularios:', err);
        const errorMsg = 'Error al cargar los formularios. Por favor, intenta de nuevo más tarde.';
        setError(errorMsg);
        showNotification(errorMsg, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAdmin()) {
      fetchFormularios();
    }
    
    // Limpiar mensaje de éxito después de 5 segundos
    if (successMessage) {
      showNotification(successMessage, 'success');
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        // Limpiar state de la navegación
        window.history.replaceState({}, document.title);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isAdmin, successMessage, showNotification]);

  const handleBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setTerminoBusqueda(valor);
    aplicarFiltros(valor, tipoFiltro);
  };

  const aplicarFiltros = (busqueda: string, tipo: string) => {
    let filtrados = [...formulariosOriginales];
    
    // Aplicar filtro de búsqueda
    if (busqueda) {
      filtrados = filtrados.filter(form => 
        form.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    
    // Aplicar filtro de tipo
    if (tipo !== 'todos') {
      filtrados = filtrados.filter(form => {
        const tipoForm = determinarTipoFormulario(form);
        return tipoForm.toLowerCase() === tipo.toLowerCase();
      });
    }
    
    setFormulariosFiltrados(filtrados);
  };

  const handleCambioTipoFiltro = (tipo: string) => {
    setTipoFiltro(tipo);
    aplicarFiltros(terminoBusqueda, tipo);
  };

  const handleDelete = async () => {
    if (formularioAEliminar !== null) {
      try {
        setIsLoading(true);
        await deleteFormulario(formularioAEliminar);
        
        // Actualizar estado local después de eliminar
        const nuevosFormularios = formulariosOriginales.filter(f => f.id !== formularioAEliminar);
        setFormulariosOriginales(nuevosFormularios);
        setFormulariosFiltrados(nuevosFormularios);
        const msg = 'Formulario eliminado correctamente';
        setSuccessMessage(msg);
        showNotification(msg, 'success');
      } catch (err: any) {
        console.error('Error al eliminar formulario:', err);
        const errorMsg = 'Error al eliminar el formulario. Por favor, intenta de nuevo más tarde.';
        setError(errorMsg);
        showNotification(errorMsg, 'error');
      } finally {
        setIsLoading(false);
        setMostrarConfirmacion(false);
        setFormularioAEliminar(null);
      }
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/formularios/editar/${id}`);
  };

  const solicitarEliminacion = (id: number) => {
    setFormularioAEliminar(id);
    setMostrarConfirmacion(true);
  };

  const cancelarEliminacion = () => {
    setMostrarConfirmacion(false);
    setFormularioAEliminar(null);
  };

  // Funciones para vista previa
  const abrirVistaPrevia = (formulario: Formulario) => {
    setFormularioVistaPrevia(formulario);
    setMostrarVistaPrevia(true);
  };

  const cerrarVistaPrevia = () => {
    setMostrarVistaPrevia(false);
    setFormularioVistaPrevia(null);
  };

  // Determinar el tipo de formulario basado en su nombre o características
  const determinarTipoFormulario = (formulario: Formulario): string => {
    const nombre = formulario.nombre.toLowerCase();
    if (nombre.includes('pre') || nombre.includes('inicial') || nombre.includes('registro')) {
      return 'Pre-evento';
    } else if (nombre.includes('post') || nombre.includes('satisfacción') || nombre.includes('evaluación')) {
      return 'Post-evento';
    }
    return 'General';
  };

  return (
    <Layout>
      <div className="min-h-screen" style={{ 
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 25%, rgba(241, 245, 249, 0.85) 75%, rgba(226, 232, 240, 0.9) 100%)'
      }}>
        <div className="max-w-7xl mx-auto p-6">
          {/* Header mejorado */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl transform rotate-1"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1e3766' }}>
                    <FaClipboardList className="text-white text-2xl" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold mb-2" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                  Gestión de Formularios
                </h1>
                <p className="text-xl text-gray-600" style={{ fontFamily: "'Recoleta Light', serif" }}>
                  Administra y configura todos los formularios de la plataforma
                </p>
              </div>
          
              {successMessage && (
                <div className="mt-6 p-6 rounded-2xl flex items-center shadow-lg" style={{
                  background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.95) 0%, rgba(209, 250, 229, 0.9) 100%)',
                  border: '1px solid rgba(34, 197, 94, 0.2)'
                }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 mr-4">
                    <FaCheck className="text-green-500 text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800" style={{ fontFamily: "'Recoleta Medium', serif" }}>Éxito</p>
                    <p className="text-green-700 text-sm" style={{ fontFamily: "'Recoleta Light', serif" }}>{successMessage}</p>
                  </div>
                </div>
              )}
          
              {error && (
                <div className="mt-6 p-6 rounded-2xl flex items-center shadow-lg" style={{
                  background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.95) 0%, rgba(252, 231, 243, 0.9) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 mr-4">
                    <FaExclamationCircle className="text-red-500 text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-800" style={{ fontFamily: "'Recoleta Medium', serif" }}>Error</p>
                    <p className="text-red-700 text-sm" style={{ fontFamily: "'Recoleta Light', serif" }}>{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Panel de búsqueda y filtros mejorado */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl transform -rotate-1"></div>
            <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-gray-100" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 50%, rgba(241, 245, 249, 0.98) 100%)',
              backdropFilter: 'blur(15px)'
            }}>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <FaSearch className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar formularios por nombre..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    style={{ fontFamily: "'Recoleta Light', serif" }}
                    value={terminoBusqueda}
                    onChange={handleBuscar}
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center">
                    <FaFilter className="text-gray-400 mr-3" />
                    <select
                      value={tipoFiltro}
                      onChange={(e) => handleCambioTipoFiltro(e.target.value)}
                      className="pl-3 pr-8 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                      style={{ fontFamily: "'Recoleta Light', serif" }}
                    >
                      <option value="todos">Todos los tipos</option>
                      <option value="pre-evento">Pre-evento</option>
                      <option value="post-evento">Post-evento</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                
                  <button
                    onClick={() => navigate('/formularios/crear')}
                    className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg hover:shadow-xl"
                    style={{
                      background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)',
                      color: 'white',
                      fontFamily: "'Recoleta Medium', serif"
                    }}
                    disabled={isLoading}
                  >
                    <FaPlus className="mr-3" />
                    Nuevo formulario
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 bg-gradient-to-r from-gray-100 to-purple-50 px-4 py-2 rounded-xl" style={{ fontFamily: "'Recoleta Light', serif" }}>
                  <span className="font-semibold">Total:</span> {formulariosFiltrados.length} formulario{formulariosFiltrados.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Grid de formularios mejorado */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="bg-white rounded-3xl p-16 shadow-2xl border border-gray-100 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#1e3766' }}>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                  <p className="text-gray-600 text-xl font-medium" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                    Cargando formularios...
                  </p>
                </div>
              </div>
            ) : formulariosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {formulariosFiltrados.map((formulario) => (
                  <div key={formulario.id} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                    <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 transform group-hover:-translate-y-2 transition-all duration-300" style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      {/* Header de la tarjeta */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1e3766' }}>
                            <FaClipboardList className="text-white text-lg" />
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            determinarTipoFormulario(formulario) === 'Pre-evento' 
                              ? 'bg-green-100 text-green-800' 
                              : determinarTipoFormulario(formulario) === 'Post-evento'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`} style={{ fontFamily: "'Recoleta Medium', serif" }}>
                            {determinarTipoFormulario(formulario)}
                          </span>
                        </div>
                      </div>

                      {/* Contenido principal */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                          {formulario.nombre}
                        </h3>

                        {/* Preguntas */}
                        <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-4 rounded-2xl">
                          <button
                            onClick={() => abrirVistaPrevia(formulario)}
                            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-purple-700 transition-all duration-200"
                            style={{ fontFamily: "'Recoleta Medium', serif" }}
                            title="Ver preguntas del formulario"
                          >
                            <div className="flex items-center space-x-2">
                              <FaQuestionCircle className="text-purple-600" />
                              <span>Preguntas</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
                                {formulario.preguntas?.length || 0} pregunta{(formulario.preguntas?.length || 0) !== 1 ? 's' : ''}
                              </span>
                              <FaEye className="text-gray-400" />
                            </div>
                          </button>
                        </div>

                        {/* Información adicional */}
                        {formulario.fecha_creacion && (
                          <div className="text-sm text-gray-500" style={{ fontFamily: "'Recoleta Light', serif" }}>
                            <span className="font-medium">Creado:</span> {new Date(formulario.fecha_creacion).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {/* Acciones */}
                      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleEdit(formulario.id!)}
                          className="p-3 rounded-xl text-blue-600 hover:text-blue-900 hover:bg-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Editar formulario"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => solicitarEliminacion(formulario.id!)}
                          className="p-3 rounded-xl text-red-600 hover:text-red-900 hover:bg-red-100 transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Eliminar formulario"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-16 shadow-2xl border border-gray-100 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-gray-100">
                    <FaExclamationCircle className="text-4xl text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                    No se encontraron formularios
                  </h3>
                  {(terminoBusqueda || tipoFiltro !== 'todos') ? (
                    <div className="space-y-4">
                      <p className="text-gray-600" style={{ fontFamily: "'Recoleta Light', serif" }}>
                        No hay formularios que coincidan con los filtros seleccionados
                      </p>
                      <button 
                        onClick={() => {
                          setTerminoBusqueda('');
                          setTipoFiltro('todos');
                          setFormulariosFiltrados(formulariosOriginales);
                        }}
                        className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                        style={{
                          backgroundColor: '#1e3766',
                          color: 'white',
                          fontFamily: "'Recoleta Medium', serif"
                        }}
                      >
                        Mostrar todos los formularios
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-600" style={{ fontFamily: "'Recoleta Light', serif" }}>
                        Crea tu primer formulario para comenzar
                      </p>
                      <button
                        onClick={() => navigate('/formularios/crear')}
                        className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg hover:shadow-xl"
                        style={{
                          background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)',
                          color: 'white',
                          fontFamily: "'Recoleta Medium', serif"
                        }}
                      >
                        <FaPlus className="mr-3" />
                        Crear primer formulario
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmación mejorado */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-gradient-to-br from-white/80 via-blue-50/90 to-gray-100/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FaTrash className="text-3xl text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                  Confirmar eliminación
                </h3>
                <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Recoleta Light', serif" }}>
                  ¿Estás seguro de que deseas eliminar este formulario? Esta acción no se puede deshacer.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={cancelarEliminacion}
                  className="flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 border-2"
                  style={{
                    backgroundColor: 'white',
                    color: '#1e3766',
                    borderColor: '#1e3766',
                    fontFamily: "'Recoleta Medium', serif"
                  }}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    color: 'white',
                    fontFamily: "'Recoleta Medium', serif"
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Eliminar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de vista previa de preguntas mejorado */}
      {mostrarVistaPrevia && formularioVistaPrevia && (
        <div className="fixed inset-0 bg-gradient-to-br from-white/80 via-blue-50/90 to-gray-100/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto transform transition-all duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                    {formularioVistaPrevia.nombre}
                  </h2>
                  <div className="flex items-center space-x-6" style={{ fontFamily: "'Recoleta Light', serif" }}>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      determinarTipoFormulario(formularioVistaPrevia) === 'Pre-evento' 
                        ? 'bg-green-100 text-green-800' 
                        : determinarTipoFormulario(formularioVistaPrevia) === 'Post-evento'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {determinarTipoFormulario(formularioVistaPrevia)}
                    </span>
                    <span className="text-gray-600">
                      <strong>{formularioVistaPrevia.preguntas?.length || 0}</strong> pregunta{(formularioVistaPrevia.preguntas?.length || 0) !== 1 ? 's' : ''}
                    </span>
                    {formularioVistaPrevia.fecha_creacion && (
                      <span className="text-gray-600">
                        Creado: {new Date(formularioVistaPrevia.fecha_creacion).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={cerrarVistaPrevia}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                  title="Cerrar vista previa"
                >
                  <FaTimes className="text-2xl text-gray-500" />
                </button>
              </div>
              
              {formularioVistaPrevia.preguntas && formularioVistaPrevia.preguntas.length > 0 ? (
                <div className="space-y-6">
                  {formularioVistaPrevia.preguntas.map((pregunta, index) => (
                    <div key={pregunta.id || index} className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl transform rotate-1"></div>
                      <div className="relative border border-gray-200 rounded-2xl p-6 bg-white shadow-lg">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold" style={{ backgroundColor: '#1e3766' }}>
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                              {pregunta.texto}
                            </h3>
                            
                            <div className="mb-4">
                              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                                pregunta.tipo === 'textual' ? 'bg-purple-100 text-purple-800' :
                                pregunta.tipo === 'seleccion_unica' ? 'bg-green-100 text-green-800' :
                                'bg-orange-100 text-orange-800'
                              }`} style={{ fontFamily: "'Recoleta Medium', serif" }}>
                                {pregunta.tipo === 'textual' ? 'Respuesta de texto' :
                                 pregunta.tipo === 'seleccion_unica' ? 'Selección única' :
                                 'Selección múltiple'}
                              </span>
                            </div>
                            
                            {pregunta.opciones && pregunta.opciones.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                                  Opciones:
                                </h4>
                                <div className="space-y-3">
                                  {pregunta.opciones.map((opcion, opcionIndex) => (
                                    <div key={opcion.id || opcionIndex} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
                                      <div className={`w-4 h-4 border-2 border-gray-300 ${
                                        pregunta.tipo === 'seleccion_unica' ? 'rounded-full' : 'rounded'
                                      } bg-white`}></div>
                                      <span className="text-gray-700 flex-1" style={{ fontFamily: "'Recoleta Light', serif" }}>
                                        {opcion.texto_opcion}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {pregunta.tipo === 'textual' && (
                              <div className="mt-4">
                                <div className="border border-gray-300 rounded-xl p-4 bg-gray-50 text-gray-500 italic text-sm" style={{ fontFamily: "'Recoleta Light', serif" }}>
                                  Área de texto para respuesta libre...
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-gray-100">
                    <FaExclamationCircle className="text-4xl text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                    Sin preguntas configuradas
                  </h3>
                  <p className="text-gray-500 text-lg" style={{ fontFamily: "'Recoleta Light', serif" }}>
                    Este formulario no tiene preguntas configuradas
                  </p>
                </div>
              )}

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={cerrarVistaPrevia}
                  className="px-6 py-3 rounded-2xl font-semibold transition-all duration-200 border-2"
                  style={{
                    backgroundColor: 'white',
                    color: '#1e3766',
                    borderColor: '#1e3766',
                    fontFamily: "'Recoleta Medium', serif"
                  }}
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    cerrarVistaPrevia();
                    handleEdit(formularioVistaPrevia.id!);
                  }}
                  className="px-8 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)',
                    color: 'white',
                    fontFamily: "'Recoleta Medium', serif"
                  }}
                >
                  <FaEdit className="mr-3" />
                  Editar formulario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default GestionarFormularios;
