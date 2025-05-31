import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarPinned, setIsSidebarPinned] = useState(() => {
    const saved = localStorage.getItem('sidebarPinned')
    return saved ? saved === 'true' : false
  })
  const [isHovered, setIsHovered] = useState(false)
  const isSidebarOpen = isSidebarPinned || isHovered

  const handleMouseEnter = () => {
    if (!isSidebarPinned) setIsHovered(true)
  }
  const handleMouseLeave = () => {
    if (!isSidebarPinned) setIsHovered(false)
  }

  const togglePin = () => {
    const newState = !isSidebarPinned
    setIsSidebarPinned(newState)
    localStorage.setItem('sidebarPinned', String(newState))
  }

  return (
    <div className="flex h-screen overflow-hidden relative bg-white">
      {/* Elementos decorativos - Burbujas y círculos */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Grupo 1: Azules - Esquina superior izquierda */}
        <div 
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full opacity-20 animate-float-slow"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #1e3766 0%, transparent 70%)',
            filter: 'blur(30px)',
            animation: 'float 20s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute top-40 left-10 w-[300px] h-[300px] rounded-full opacity-15 animate-float-slower"
          style={{
            background: 'radial-gradient(circle at 40% 40%, #2563eb 0%, transparent 60%)',
            filter: 'blur(25px)',
            animation: 'float 25s ease-in-out infinite'
          }}
        />

        {/* Grupo 2: Verdes - Centro derecha */}
        <div 
          className="absolute top-1/4 -right-20 w-[400px] h-[400px] rounded-full opacity-15 animate-float-slow"
          style={{
            background: 'radial-gradient(circle at 60% 60%, #059669 0%, transparent 65%)',
            filter: 'blur(35px)',
            animation: 'float 22s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute top-1/3 right-40 w-[250px] h-[250px] rounded-full opacity-10 animate-float-slower"
          style={{
            background: 'radial-gradient(circle at 70% 70%, #10b981 0%, transparent 60%)',
            filter: 'blur(20px)',
            animation: 'float 28s ease-in-out infinite'
          }}
        />

        {/* Grupo 3: Naranjas - Centro izquierda */}
        <div 
          className="absolute top-1/2 -left-10 w-[350px] h-[350px] rounded-full opacity-15 animate-float"
          style={{
            background: 'radial-gradient(circle at 40% 40%, #f97316 0%, transparent 65%)',
            filter: 'blur(30px)',
            animation: 'float 24s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute top-2/3 left-20 w-[200px] h-[200px] rounded-full opacity-10 animate-float-slow"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #fb923c 0%, transparent 60%)',
            filter: 'blur(15px)',
            animation: 'float 26s ease-in-out infinite'
          }}
        />

        {/* Grupo 4: Rojos - Esquina inferior derecha */}
        <div 
          className="absolute -bottom-20 -right-20 w-[450px] h-[450px] rounded-full opacity-15 animate-float-slower"
          style={{
            background: 'radial-gradient(circle at 60% 60%, #dc2626 0%, transparent 70%)',
            filter: 'blur(35px)',
            animation: 'float 23s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute bottom-40 right-10 w-[275px] h-[275px] rounded-full opacity-10 animate-float"
          style={{
            background: 'radial-gradient(circle at 70% 70%, #ef4444 0%, transparent 65%)',
            filter: 'blur(20px)',
            animation: 'float 27s ease-in-out infinite'
          }}
        />

        {/* Círculos adicionales dispersos */}
        <div 
          className="absolute top-1/2 right-1/3 w-[150px] h-[150px] rounded-full opacity-10 animate-float-slow"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 60%)',
            filter: 'blur(15px)',
            animation: 'float 30s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute bottom-1/4 left-1/3 w-[225px] h-[225px] rounded-full opacity-10 animate-float-slower"
          style={{
            background: 'radial-gradient(circle at 40% 40%, #84cc16 0%, transparent 65%)',
            filter: 'blur(20px)',
            animation: 'float 32s ease-in-out infinite'
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        togglePin={togglePin}
      />

      {/* Contenido */}
      <div
        className={`
          flex flex-col flex-1 transition-all duration-300 z-10 bg-transparent relative
          ${isSidebarOpen ? 'ml-64' : 'ml-16'}
        `}
      >
        <Header
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={togglePin}
        />

        <main 
          className="flex-1 overflow-auto p-6 relative bg-transparent"
          style={{ height: 'calc(100vh - 64px)' }}
        >
          {children}
        </main>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(10px, 10px) rotate(2deg); }
            50% { transform: translate(-5px, 15px) rotate(-1deg); }
            75% { transform: translate(-10px, 5px) rotate(1deg); }
          }
          .animate-float {
            animation: float 20s ease-in-out infinite;
          }
          .animate-float-slow {
            animation: float 25s ease-in-out infinite;
          }
          .animate-float-slower {
            animation: float 30s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  )
}

export default Layout
