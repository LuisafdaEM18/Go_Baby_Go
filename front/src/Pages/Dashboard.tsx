import React from 'react';
import { FaHome, FaSignInAlt, FaChevronRight, FaFileAlt, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo-Go-baby-Go-2024-02-1.png'; 

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  to: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, to, active = false }) => {
  return (
    <Link 
      to={to}
      className={`flex items-center p-4 transition-colors duration-200 overflow-hidden text-white
        ${active ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
    >
      <div className="flex-shrink-0 text-xl text-white">
        {icon}
      </div>
      <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap text-white">
        {text}
      </span>
    </Link>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full bg-blue-900 text-white transition-all duration-300 ease-in-out 
        w-16 hover:w-64 group z-50 flex flex-col">
        
        {/* Logo y nombre (aparece al hacer hover) */}
        <div className="flex items-center justify-between p-4 border-b border-white h-16">
          <div className="flex items-center">
            {/* Logo real reemplazando el placeholder */}
            <img 
              src={logo} 
              alt="Go baby Go Logo" 
              className="w-9 h-8 object-contain rounded-md" 
            />
            {/* Nombre que aparece al hacer hover */}
            <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap text-lg font-semibold text-white">
              Go baby Go
            </span>
          </div>
          <FaChevronRight className="transform group-hover:rotate-180 transition-transform duration-300 text-white" />
        </div>

        {/* Contenido principal del sidebar */}
        <div className="flex flex-col flex-1 justify-between">
          {/* Botones principales */}
          <nav className="mt-4">
            <SidebarItem 
              icon={<FaCalendarAlt className="text-white" />} 
              text="Evento" 
              to="/Eventos" 
            />
            <SidebarItem 
              icon={<FaFileAlt className="text-white" />} 
              text="Formulario" 
              to="/forms" 
            />
          </nav>
          
          {/* Login en la parte inferior */}
          <nav className="mb-4">
            <SidebarItem 
              icon={<FaSignInAlt className="text-white"/>} 
              text="Cerrar Sesión"
              to="/login" 
            />
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col ml-16 group-hover:ml-64 transition-all duration-300">
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Tu contenido aquí */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;