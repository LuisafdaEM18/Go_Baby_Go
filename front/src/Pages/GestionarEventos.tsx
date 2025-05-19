import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaExclamationCircle } from 'react-icons/fa';
import Layout from '../Components/Layout';

const GestionarEventos = () => {
  const navigate = useNavigate();
  const [eventosOriginales, setEventosOriginales] = useState([
    { 
      id: 1, 
      nombre: 'Go baby go', 
      fecha: '15-11-2023',
      ubicacion: 'UdeM', 
      estado: 'completado',
      formularioPre: 'evaluacion',
      formularioPost: 'satisfaccion'
    },
    { 
      id: 2, 
      nombre: 'Partido', 
      fecha: '15-11-2023',
      ubicacion: 'UdeM', 
      estado: 'completado',
      formularioPre: 'evaluacion',
      formularioPost: 'satisfaccion'
    },
    { 
      id: 3, 
      nombre: 'Conferencia UdeM', 
      fecha: '15-11-2023',
      ubicacion: 'UdeM', 
      estado: 'completado',
      formularioPre: 'evaluacion',
      formularioPost: 'satisfaccion'
    },
  ]);
  
  const [eventosFiltrados, setEventosFiltrados] = useState(eventosOriginales);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [eventoAEliminar, setEventoAEliminar] = useState<number | null>(null);

  const handleBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setTerminoBusqueda(valor);
    
    if (valor === '') {
      setEventosFiltrados(eventosOriginales);
      return;
    }
    
    const filtrados = eventosOriginales.filter(evento =>
      evento.nombre.toLowerCase().includes(valor.toLowerCase())
    );
    
    setEventosFiltrados(filtrados);
  };

  const handleDelete = () => {
    if (eventoAEliminar) {
      const nuevosEventos = eventosOriginales.filter(evento => evento.id !== eventoAEliminar);
      setEventosOriginales(nuevosEventos);
      setEventosFiltrados(nuevosEventos);
      console.log('Evento eliminado:', eventoAEliminar);
    }
    setMostrarConfirmacion(false);
    setEventoAEliminar(null);
  };

  const handleEdit = (id: number) => {
    navigate(`/eventos/editar/${id}`);
  };

  const solicitarEliminacion = (id: number) => {
    setEventoAEliminar(id);
    setMostrarConfirmacion(true);
  };

  const cancelarEliminacion = () => {
    setMostrarConfirmacion(false);
    setEventoAEliminar(null);
  };

  return (
    <Layout>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={terminoBusqueda}
                onChange={handleBuscar}
              />
            </div>
            <button
              onClick={() => navigate('/eventos/crear')}
              className="bg-blue-900 text-white font-semibold px-4 py-2 rounded"
                style={{
                  backgroundColor: '#1e3766',
                  color: 'white',
                  fontFamily: "'Recoleta', serif"
                }}
              
            >
              Nuevo Evento
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {eventosFiltrados.length > 0 ? (
                  eventosFiltrados.map((evento) => (
                    <tr key={evento.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{evento.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evento.fecha}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evento.ubicacion}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          evento.estado === 'activo' ? 'bg-green-100 text-green-800' :
                          evento.estado === 'completado' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {evento.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(evento.id)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => solicitarEliminacion(evento.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FaExclamationCircle className="text-2xl mb-2" />
                        <p>No se encontraron eventos con ese nombre</p>
                        <button 
                          onClick={() => {
                            setTerminoBusqueda('');
                            setEventosFiltrados(eventosOriginales);
                          }}
                          className="mt-2 text-blue-600 hover:text-blue-800"
                        >
                          Mostrar todos los eventos
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {mostrarConfirmacion && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirmar eliminación</h3>
            <p className="mb-6">¿Estás seguro que deseas eliminar este evento? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelarEliminacion}
                className="bg-blue-900 text-white font-semibold px-4 py-2 rounded"
                style={{
                  backgroundColor: '#1e3766',
                  color: 'white',
                  fontFamily: "'Recoleta', serif"
                }}
              
            
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="bg-blue-900 text-white font-semibold px-4 py-2 rounded"
                style={{
                  backgroundColor: '#1e3766',
                  color: 'white',
                  fontFamily: "'Recoleta', serif"
                }}
              
            
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default GestionarEventos;
