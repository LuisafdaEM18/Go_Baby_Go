import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaExclamationCircle, FaCheck, FaSpinner, FaFilter } from 'react-icons/fa';
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

  // Constantes de estilo para mantener consistencia
  const primaryColor = '#1e3766';
  const primaryBgColor = 'bg-[#1e3766]';
  const primaryHoverBgColor = 'hover:bg-blue-800';
  const fontStyle = { fontFamily: "'Recoleta', serif" };

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
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 
            className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200"
            style={{ color: primaryColor, ...fontStyle }}
          >
            Gestión de Formularios
          </h2>
          
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md flex items-center">
              <FaCheck className="mr-2" />
              {successMessage}
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md flex items-center">
              <FaExclamationCircle className="mr-2" />
              {error}
            </div>
          )}
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar formularios..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={terminoBusqueda}
                  onChange={handleBuscar}
                />
              </div>
              
              <div className="relative flex items-center">
                <FaFilter className="text-gray-400 mr-2" />
                <select
                  value={tipoFiltro}
                  onChange={(e) => handleCambioTipoFiltro(e.target.value)}
                  className="pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="todos">Todos los tipos</option>
                  <option value="pre-evento">Pre-evento</option>
                  <option value="post-evento">Post-evento</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/formularios/crear')}
              className={`px-4 py-2 rounded-md font-semibold shadow-sm flex items-center ${primaryBgColor} text-white ${primaryHoverBgColor} transition duration-150`}
              style={fontStyle}
              disabled={isLoading}
            >
              <FaPlus className="mr-2" />
              Nuevo Formulario
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Preguntas</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                      </div>
                      <p className="mt-2 text-gray-500">Cargando formularios...</p>
                    </td>
                  </tr>
                ) : formulariosFiltrados.length > 0 ? (
                  formulariosFiltrados.map((formulario) => (
                    <tr key={formulario.id} className="hover:bg-blue-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: primaryColor }}>
                        {formulario.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          determinarTipoFormulario(formulario) === 'Pre-evento' 
                            ? 'bg-green-100 text-green-800' 
                            : determinarTipoFormulario(formulario) === 'Post-evento'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {determinarTipoFormulario(formulario)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {formulario.preguntas?.length || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleEdit(formulario.id!)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-150"
                            title="Editar formulario"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => solicitarEliminacion(formulario.id!)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition duration-150"
                            title="Eliminar formulario"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FaExclamationCircle className="text-3xl mb-3 text-gray-400" />
                        <p className="mb-2">No se encontraron formularios</p>
                        {(terminoBusqueda || tipoFiltro !== 'todos') && (
                          <button 
                            onClick={() => {
                              setTerminoBusqueda('');
                              setTipoFiltro('todos');
                              setFormulariosFiltrados(formulariosOriginales);
                            }}
                            className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Mostrar todos los formularios
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-900" style={fontStyle}>Confirmar eliminación</h3>
            <p className="mb-6 text-gray-700">
              ¿Estás seguro de que deseas eliminar este formulario? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelarEliminacion}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-150"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center transition duration-150"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <FaTrash className="mr-2" />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default GestionarFormularios;
