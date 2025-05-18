import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaExclamationCircle, FaCheck } from 'react-icons/fa';
import Layout from '../Components/Layout';

const GestionarFormularios = () => {
  const navigate = useNavigate();
  const [formulariosOriginales, setFormulariosOriginales] = useState([
    { id: 1, nombre: 'Evaluación Inicial', tipo: 'Pre-evento', descripcion: 'Formulario de evaluación inicial' },
    { id: 2, nombre: 'Encuesta de Satisfacción', tipo: 'Post-evento', descripcion: 'Formulario para medir satisfacción' },
    { id: 3, nombre: 'Formulario Médico', tipo: 'Pre-evento', descripcion: 'Datos de salud del voluntario' },
  ]);

  const [formulariosFiltrados, setFormulariosFiltrados] = useState(formulariosOriginales);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [formularioAEliminar, setFormularioAEliminar] = useState<number | null>(null);

  const handleBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setTerminoBusqueda(valor);

    if (valor === '') {
      setFormulariosFiltrados(formulariosOriginales);
      return;
    }

    const filtrados = formulariosOriginales.filter(formulario =>
      formulario.nombre.toLowerCase().includes(valor.toLowerCase())
    );

    setFormulariosFiltrados(filtrados);
  };

  const handleDelete = () => {
    if (formularioAEliminar !== null) {
      const nuevosFormularios = formulariosOriginales.filter(f => f.id !== formularioAEliminar);
      setFormulariosOriginales(nuevosFormularios);
      setFormulariosFiltrados(nuevosFormularios);
      console.log('Formulario eliminado:', formularioAEliminar);
    }
    setMostrarConfirmacion(false);
    setFormularioAEliminar(null);
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

 const handleAsignar = (id: number) => {
  const formulario = formulariosOriginales.find(f => f.id === id);
  if (formulario) {
    localStorage.setItem('formularioAsignado', JSON.stringify(formulario));
    alert(`Formulario "${formulario.nombre}" asignado exitosamente.`);
  }
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
                placeholder="Buscar formularios..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={terminoBusqueda}
                onChange={handleBuscar}
              />
            </div>
            <button
              onClick={() => navigate('/formularios/crear')}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 whitespace-nowrap"
            >
              <FaPlus className="mr-2" />
              Nuevo Formulario
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formulariosFiltrados.length > 0 ? (
                  formulariosFiltrados.map((formulario) => (
                    <tr key={formulario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formulario.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formulario.tipo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formulario.descripcion}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-4">
                        <button
                          onClick={() => handleEdit(formulario.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => solicitarEliminacion(formulario.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => handleAsignar(formulario.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <FaCheck />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FaExclamationCircle className="text-2xl mb-2" />
                        <p>No se encontraron formularios con ese nombre</p>
                        <button 
                          onClick={() => {
                            setTerminoBusqueda('');
                            setFormulariosFiltrados(formulariosOriginales);
                          }}
                          className="mt-2 text-blue-600 hover:text-blue-800"
                        >
                          Mostrar todos los formularios
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
            <p className="mb-6">¿Estás seguro que deseas eliminar este formulario? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end space-x-4">
              <button
                 onClick={() => navigate('/formularios/gestionar')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                 <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default GestionarFormularios;
