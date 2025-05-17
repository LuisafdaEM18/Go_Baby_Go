import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";


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
    <header className="flex justify-between items-center px-6 py-3 bg-white shadow-md h-16">
      <h1 className="text-3xl font-bold text-blue-900">Mi Empresa</h1>

      <div
        className="relative group"
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
      >
        <button className="text-3xl text-blue-900 hover:text-blue-700 focus:outline-none">
          <FaUserCircle />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100">
              Perfil
            </button>
            <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100">
              Configuración
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};


export default Header;
