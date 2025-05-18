import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

type HeaderProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const Header: React.FC<HeaderProps> = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="flex flex-col w-full bg-white shadow-sm">
      <div 
        className="flex justify-between items-center px-4 py-2 border-b"
        style={{ backgroundColor: '#1e3766', height: '60px' }}
      >
        <h1 
          className="text-white font-light"
          style={{ 
            fontFamily: "'Recoleta', serif",
            fontSize: '24px', // Tamaño reducido
            lineHeight: '1'
          }}
        >
          El Comité
        </h1>

        <div className="relative group">
          {/* Botón circular con ícono centrado */}
          <button 
            className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-700 text-white hover:bg-blue-600 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaUser className="text-sm" /> {/* Ícono ajustado al círculo */}
          </button>

          {menuOpen && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              onMouseLeave={() => setMenuOpen(false)}
              style={{ fontFamily: "'Avenir', sans-serif" }} 
            >
              <button 
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => navigate('/perfil')}
              >
                Perfil
              </button>
              <button 
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => navigate('/configuracion')}
              >
                Configuración
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-red-600 transition-colors"
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