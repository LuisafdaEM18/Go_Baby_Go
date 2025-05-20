import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <main className="flex-grow flex flex-col items-center justify-center p-4 mx-auto max-w-4xl w-full">
        <h1 className="text-4xl font-recolecta medium text-blue-900 mb-30">El Comité</h1>
        
        <div className="space-y-5 w-full max-w-md">
          <Link 
            to="/registro-voluntario" 
            className="w-90 h-13 block w-full bg-white- hover:bg-white text-blue font-medium py-3 px-4 rounded-lg text-center transition duration-200 border-2 border-blue-900 "
          >
            Registrarse como Voluntario
          </Link>
          
          <Link 
            to="/login" 
            className="block w-full bg-white- hover:bg-white text-blue font-medium py-3 px-4 rounded-lg text-center transition duration-200 border-2 border-blue-900 "
          >
            Iniciar Sesión
          </Link>
        </div>
      </main>

      <footer className="p-4 text-center text-gray-500 text-sm">
        <p>Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Home;