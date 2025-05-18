import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        togglePin={() => setIsSidebarPinned((p) => !p)}
      />

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

        <main 
          className="flex-1 overflow-auto flex items-center justify-center"
          style={{ height: 'calc(100vh - 64px)' }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
