import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaSave, FaPlus, FaTimes } from 'react-icons/fa';
import Layout from '../Components/Layout';
import { createFormulario } from '../services/formularioService';
import { useNotification } from '../context/NotificationContext';

const FormularioCrear: React.FC = () => {
  const navigate = useNavigate();
  const [nombreFormulario, setNombreFormulario] = useState('');
  const [errorNombre, setErrorNombre] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const [preguntas, setPreguntas] = useState<
    { texto: string; tipo: 'textual' | 'seleccion_multiple' | 'seleccion_unica'; opciones?: { texto_opcion: string }[] }[]
  >([]);

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [connectionRetries, setConnectionRetries] = useState(0);



  const agregarPregunta = () => {
    setPreguntas([...preguntas, { texto: '', tipo: 'textual' }]);
  };

  const eliminarPregunta = (index: number) => {
    const nuevas = preguntas.filter((_, i) => i !== index);
    setPreguntas(nuevas);
  };

  const actualizarPregunta = (index: number, campo: string, valor: string) => {
    const nuevas = [...preguntas];
    if (campo === 'tipo') {
      nuevas[index].tipo = valor as 'textual' | 'seleccion_multiple' | 'seleccion_unica';
      if (valor === 'seleccion_multiple' || valor === 'seleccion_unica') {
        nuevas[index].opciones = [{ texto_opcion: '' }];
      } else {
        delete nuevas[index].opciones;
      }
    } else {
      nuevas[index].texto = valor;
    }
    setPreguntas(nuevas);
  };

  const actualizarOpcion = (index: number, opcionIndex: number, valor: string) => {
    const nuevas = [...preguntas];
    if (nuevas[index].opciones) {
      nuevas[index].opciones![opcionIndex].texto_opcion = valor;
      setPreguntas(nuevas);
    }
  };

  const agregarOpcion = (index: number) => {
    const nuevas = [...preguntas];
    nuevas[index].opciones?.push({ texto_opcion: '' });
    setPreguntas(nuevas);
  };

  const eliminarOpcion = (preguntaIndex: number, opcionIndex: number) => {
    const nuevas = [...preguntas];
    if (nuevas[preguntaIndex].opciones && nuevas[preguntaIndex].opciones!.length > 1) {
      nuevas[preguntaIndex].opciones = nuevas[preguntaIndex].opciones!.filter((_, i) => i !== opcionIndex);
      setPreguntas(nuevas);
    }
  };

  const validarFormulario = () => {
    let valido = true;
    
    // Validar nombre
    if (!nombreFormulario.trim()) {
      setErrorNombre('El nombre del formulario es obligatorio');
      showNotification('El nombre del formulario es obligatorio', 'error');
      valido = false;
    } else {
      setErrorNombre('');
    }
    
    // Validar preguntas
    if (preguntas.length === 0) {
      setError('Debe agregar al menos una pregunta al formulario');
      showNotification('Debe agregar al menos una pregunta al formulario', 'error');
      valido = false;
      return false;
    }
    
    // Validar cada pregunta
    for (const [index, pregunta] of preguntas.entries()) {
      if (!pregunta.texto.trim()) {
        setError(`Pregunta ${index + 1}: El texto de la pregunta es obligatorio`);
        showNotification(`Pregunta ${index + 1}: El texto de la pregunta es obligatorio`, 'error');
        valido = false;
        return false;
      }
      
      if ((pregunta.tipo === 'seleccion_multiple' || pregunta.tipo === 'seleccion_unica') && 
          (!pregunta.opciones || pregunta.opciones.length === 0)) {
        setError(`Pregunta ${index + 1}: Las preguntas de selección deben tener al menos una opción`);
        showNotification(`Pregunta ${index + 1}: Las preguntas de selección deben tener al menos una opción`, 'error');
        valido = false;
        return false;
      }
      
      if (pregunta.opciones) {
        for (const [opIndex, opcion] of pregunta.opciones.entries()) {
          if (!opcion.texto_opcion.trim()) {
            setError(`Pregunta ${index + 1}, Opción ${opIndex + 1}: El texto de la opción es obligatorio`);
            showNotification(`Pregunta ${index + 1}, Opción ${opIndex + 1}: El texto de la opción es obligatorio`, 'error');
            valido = false;
            return false;
          }
        }
      }
    }
    
    return valido;
  };

  const handleCrearClick = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      setMostrarConfirmacion(true);
    }
  };

  const confirmarCrear = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Crear el objeto de formulario en el formato que espera el backend
      const preguntasFormateadas = preguntas.map(pregunta => ({
        texto: pregunta.texto,
        tipo: pregunta.tipo,
        opciones: pregunta.opciones || []
      }));
      
      const formularioData = {
        nombre: nombreFormulario,
        preguntas: preguntasFormateadas
      };
      
      console.log('Enviando formulario:', formularioData);
      
      try {
        await createFormulario(formularioData);
        showNotification('Formulario creado con éxito', 'success');
        setMostrarConfirmacion(false);
        navigate('/formularios/gestionar');
      } catch (err: any) {
        console.error('Error al crear formulario:', err);
        
        // Intentar nuevamente si es un error de conexión
        if (err.message && err.message.includes('conexión') && connectionRetries < 2) {
          setConnectionRetries(prev => prev + 1);
          showNotification('Reintentando conexión con el servidor...', 'warning');
          
          // Esperar un momento antes de reintentar
          setTimeout(() => {
            confirmarCrear();
          }, 1500);
          return;
        }
        
        const errorMsg = err.message || 'Error al crear el formulario. Por favor, intenta de nuevo.';
        setError(errorMsg);
        showNotification(errorMsg, 'error');
        setMostrarConfirmacion(false);
      }
    } catch (err: any) {
      console.error('Error general al crear formulario:', err);
      const errorMsg = err.message || 'Error inesperado al crear el formulario.';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelarCrear = () => {
    setMostrarConfirmacion(false);
  };

  // Obtener un color de fondo aleatorio para los números de preguntas
  const getRandomPastelColor = (index: number) => {
    const colors = [
      'bg-blue-100 border-blue-300 text-blue-800',
      'bg-purple-100 border-purple-300 text-purple-800',
      'bg-green-100 border-green-300 text-green-800',
      'bg-pink-100 border-pink-300 text-pink-800',
      'bg-yellow-100 border-yellow-300 text-yellow-800',
      'bg-indigo-100 border-indigo-300 text-indigo-800',
    ];
    return colors[index % colors.length];
  };

  return (
    <Layout>
     <div className="min-h-screen py-8 px-4 bg-gray-50">
        <form 
          onSubmit={handleCrearClick}
          className="max-w-4xl mx-auto space-y-6 p-8 shadow-lg rounded-lg bg-white"

        >
                      <h2 
              className="text-3xl font-bold text-center mb-8 text-gray-900"
            >
            Crear Formulario
          </h2>

          {error && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg flex items-center">
              <FaExclamationTriangle className="mr-2" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nombre del formulario</label>
              <input
                type="text"
                value={nombreFormulario}
                onChange={(e) => setNombreFormulario(e.target.value)}
                className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errorNombre ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Formulario pre-evento"
              />
              {errorNombre && <p className="mt-1 text-sm text-red-600">{errorNombre}</p>}
            </div>
          </div>

          <div className="space-y-6 mt-8">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg text-gray-900">Preguntas del formulario</h3>
              <span className="text-sm text-gray-500">Total: {preguntas.length}</span>
            </div>
            
            {preguntas.length === 0 && (
              <div className="text-center p-6 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">Aún no hay preguntas. Haz clic en "Agregar nueva pregunta" para comenzar.</p>
              </div>
            )}
            
            {preguntas.map((preg, idx) => (
              <div key={idx} className="border border-gray-200 p-5 rounded-lg bg-blue-50 space-y-4 relative shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2 w-full">
                    <span 
                      className={`font-bold w-8 h-8 flex items-center justify-center rounded-full border-2 shadow-sm ${getRandomPastelColor(idx)}`}
                    >
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Escribe tu pregunta"
                      value={preg.texto}
                      onChange={(e) => actualizarPregunta(idx, 'texto', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => eliminarPregunta(idx)}
                    className="ml-2 p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition duration-150 shadow-sm"
                    aria-label="Eliminar pregunta"
                    title="Eliminar pregunta"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>

                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de pregunta</label>
                  <select
                    value={preg.tipo}
                    onChange={(e) => actualizarPregunta(idx, 'tipo', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  >
                    <option value="textual">Respuesta de texto</option>
                    <option value="seleccion_unica">Selección única</option>
                    <option value="seleccion_multiple">Selección múltiple</option>
                  </select>
                </div>

                {(preg.tipo === 'seleccion_multiple' || preg.tipo === 'seleccion_unica') && preg.opciones && (
                  <div className="space-y-3 mt-3 pl-4 border-l-2 border-blue-200">
                    <label className="block text-sm font-medium text-gray-700">Opciones de respuesta</label>
                    {preg.opciones.map((op, i) => (
                      <div key={i} className="flex items-center">
                        <div className={`w-6 h-6 flex items-center justify-center mr-2 rounded-full shadow-sm ${getRandomPastelColor(i)}`}>
                          {i + 1}
                        </div>
                        <input
                          type="text"
                          placeholder={`Opción ${i + 1}`}
                          value={op.texto_opcion}
                          onChange={(e) => actualizarOpcion(idx, i, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        />
                        {preg.opciones && preg.opciones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => eliminarOpcion(idx, i)}
                            className="ml-2 p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition duration-150 shadow-sm"
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
                      className="flex items-center text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
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
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition flex items-center justify-center"
          >
            <FaPlus className="mr-2" />
            Agregar nueva pregunta
          </button>

          <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/formularios/gestionar')}
              className="px-6 py-2 border border-gray-300 rounded-md font-semibold shadow-sm hover:bg-gray-50 transition duration-150"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Guardar formulario
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Diálogo de confirmación */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full animate-fade-in-down">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Confirmar creación</h3>
            <p className="mb-6 text-gray-700">
              ¿Estás seguro de que deseas crear este formulario? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelarCrear}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-150 shadow-sm"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarCrear}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Guardando...
                  </div>
                ) : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default FormularioCrear;