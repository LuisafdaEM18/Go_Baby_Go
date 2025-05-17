import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Estado compartido para sidebar
  const [isSidebarPinned, setIsSidebarPinned] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const isSidebarOpen = isSidebarPinned || isHovered

  const handleMouseEnter = () => {
    if (!isSidebarPinned) setIsHovered(true)
  }
  const handleMouseLeave = () => {
    if (!isSidebarPinned) setIsHovered(false)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar recibe sus props */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        togglePin={() => setIsSidebarPinned((p) => !p)}
      />

      {/* Contenedor principal se corre según isSidebarOpen */}
      <div
        className={`
          flex flex-col flex-1 transition-all duration-300 
          ${isSidebarOpen ? 'ml-64' : 'ml-16'}
        `}
      >
        <Header
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarPinned((p) => !p)}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
