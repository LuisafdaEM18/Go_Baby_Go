import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileImage from "./ProfileImage";

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

  // Estilos para la animación del dropdown
  const dropdownStyle = {
    fontFamily: "'Avenir', sans-serif",
    animation: menuOpen ? 'slideDown 0.2s ease-out' : 'none'
  };

  return (
    <>
      {/* Inyectar estilos CSS para animaciones */}
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
      
      <header className="flex flex-col w-full bg-white shadow-sm">
        <div 
          className="flex justify-between items-center px-4 py-2 border-b"
          style={{ backgroundColor: '#1e3766', height: '60px' }}
        >
          <h1 
            className="text-white font-semibold"
            style={{ 
              fontFamily: "'Recoleta', serif",
              fontSize: '24px',
              lineHeight: '1'
            }}
          >
            El Comité
          </h1>

          <div className="relative">
            {/* Contenedor del perfil mejorado */}
            <button 
              className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md"
              style={{ 
                backgroundColor: '#1e3766',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2d4a7a';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1e3766';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = '#152955';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.5)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = '#2d4a7a';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.4)';
              }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {/* Imagen de perfil usando el componente optimizado */}
              <ProfileImage size="md" alt="Go Baby Go Profile" />
              
              {/* Nombre del usuario */}
              <span className="text-white text-sm font-medium hidden md:block">
                {user?.nombre || 'Administrador'}
              </span>
              
              {/* Indicador de menú */}
              <svg 
                className="w-4 h-4 text-white transition-transform duration-200"
                style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Menú desplegable */}
            {menuOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                onMouseLeave={() => setMenuOpen(false)}
                style={dropdownStyle}
              >
                <div className="py-1">
                  <button 
                    className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => {
                      navigate('/perfil');
                      setMenuOpen(false);
                    }}
                  >
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Perfil
                  </button>
                  
                  <button 
                    className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => {
                      navigate('/configuracion');
                      setMenuOpen(false);
                    }}
                  >
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Configuración
                  </button>
                  
                  <hr className="my-1 border-gray-200" />
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
