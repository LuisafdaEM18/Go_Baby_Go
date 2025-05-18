import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaExclamationTriangle } from 'react-icons/fa';
import Layout from '../Components/Layout';

const EditarFormulario = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [cargando, setCargando] = useState(true);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMostrarConfirmacion(true);
  };

  const confirmarActualizacion = () => {
    console.log('Formulario actualizado:', formData);
    navigate('/formularios');
  };

  const cancelarActualizacion = () => {
    setMostrarConfirmacion(false);
  };

  if (cargando) {
    return (
      <Layout>
        <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
          <div className="text-center">Cargando formulario...</div>
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
        <h1 style={{ fontSize: '16px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>Editar Formulario</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Formulario</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="pre-evento">Pre-Evento</option>
                <option value="post-evento">Post-Evento</option>
              </select>
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
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/formularios/gestionar}')}
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
            <p className="mb-6">¿Estás seguro que deseas guardar los cambios realizados a este formulario?</p>
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

export default EditarFormulario;
