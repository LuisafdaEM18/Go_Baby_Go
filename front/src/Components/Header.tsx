import { useState } from "react";
import logoBabygo from '../assets/logo-babygo.png';

type HeaderProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const Header: React.FC<HeaderProps> = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleLogout = () => {
    console.log("Cerrando sesión...");
  };

  return (
    <header className="flex flex-col w-full bg-white shadow-sm font-['Recoleta']">
      <div 
        className="flex justify-between items-center px-6 border-b"
        style={{ backgroundColor: '#1e3766', height: '100px' }} 
      >
        <h1 
          className="text-2xl font-medium text-white" 
          style={{ fontFamily: "'Recoleta', serif", fontWeight: 200, fontSize: '48px' }}
        >
          El Comité
        </h1>
        <div className="relative group">
          <button 
            className="text-2xl text-white hover:text-blue-200 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              margin: 0
             }}
          >
            <img
              src={logoBabygo}
              alt="Logo Go Baby Go"
              style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
            />
          </button>

          {menuOpen && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              onMouseLeave={() => setMenuOpen(false)}
              style={{ fontFamily: "'Avenir', sans-serif" }} 
            >
              <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50">
                Perfil
              </button>
              <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50">
                Configuración
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50"
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