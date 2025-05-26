import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoBabyGo from "../assets/logo-babygo.png";

type HeaderProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const Header: React.FC<HeaderProps> = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex flex-col w-full bg-white shadow-sm">
      <div 
        className="flex justify-between items-center px-4 py-2 border-b"
        style={{ backgroundColor: '#1e3766' }}
      >
        <div className="flex items-center">
          <img 
            src={GoBabyGo} 
            alt="Go Baby Go Logo" 
            className="h-12 w-auto"
          />
        </div>

        <div className="relative">
          <button 
            className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-white hover:bg-opacity-10"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white bg-white flex-shrink-0">
              <img 
                src={GoBabyGo} 
                alt="Go Baby Go Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left text-white">
              <div className="text-sm font-medium">{user?.nombre || 'Usuario'}</div>
              <div className="text-xs opacity-75">{user?.correo || 'usuario@ejemplo.com'}</div>
            </div>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
              <button
                onClick={() => {
                  navigate('/perfil');
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Perfil
              </button>
              <button
                onClick={() => {
                  navigate('/configuracion');
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Configuración
              </button>
              <hr className="my-1" />
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;