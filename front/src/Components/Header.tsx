import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaCog, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

type HeaderProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const Header: React.FC<HeaderProps> = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Cerrar menú cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="flex flex-col w-full bg-white shadow-sm">
      <div 
        className="flex justify-between items-center px-8 py-3 border-b"
        style={{ backgroundColor: '#1e3766', height: '64px' }}
      >
        <div className="flex items-center flex-1">
          <h1 className="header-title text-white text-lg font-light">
            El Comit<span style={{ color: '#73a31d' }}>é</span>
          </h1>
        </div>

        <div className="relative" ref={menuRef}>
          <button 
            className="header-admin-button flex items-center space-x-4 px-6 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            style={{ 
              backgroundColor: '#2563eb',
              backgroundImage: 'none',
              border: 'none',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-white flex items-center justify-center flex-shrink-0">
              <FaUserCircle className="w-full h-full text-[#1e3766]" />
            </div>
            <div className="text-left text-white">
              <div className="text-base font-medium">{user?.nombre || 'Usuario'}</div>
            </div>
            <svg 
              className={`w-4 h-4 text-white transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <FaUser className="mr-3 text-gray-600" />
                Perfil
              </button>
              <button
                onClick={() => {
                  navigate('/configuracion');
                  setMenuOpen(false);
                }}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <FaCog className="mr-3 text-gray-600" />
                Configuración
              </button>
              <hr className="my-1" />
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <FaSignOutAlt className="mr-3 text-red-600" />
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