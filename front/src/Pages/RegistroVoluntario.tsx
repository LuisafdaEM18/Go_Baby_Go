import React, { useEffect, useState } from 'react';

const RegistroVoluntario = () => {
  const [formularioAsignado, setFormularioAsignado] = useState<any>(null);
  const [respuestas, setRespuestas] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const data = localStorage.getItem('formularioAsignado');
    if (data) {
      setFormularioAsignado(JSON.parse(data));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRespuestas(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Respuestas del formulario:', respuestas);
    alert('Formulario enviado correctamente ✅');
    // Puedes guardar en localStorage, enviar a una API, etc.
    // localStorage.setItem('respuestasFormulario', JSON.stringify(respuestas));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Formulario asignado</h1>

      {formularioAsignado ? (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-medium">{formularioAsignado.nombre}</h2>
          <p className="text-gray-600 mb-4">Descripción: {formularioAsignado.descripcion}</p>

          {/* Campos de ejemplo (puedes ajustar según tu tipo de formulario real) */}
          <div>
            <label className="block text-sm font-medium">Nombre completo</label>
            <input
              type="text"
              name="nombreCompleto"
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Edad</label>
            <input
              type="number"
              name="edad"
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Comentario</label>
            <textarea
              name="comentario"
              rows={3}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Enviar
          </button>
        </form>
      ) : (
        <p className="text-gray-500">Aún no se ha asignado ningún formulario.</p>
      )}
    </div>
  );
};

export default RegistroVoluntario;
