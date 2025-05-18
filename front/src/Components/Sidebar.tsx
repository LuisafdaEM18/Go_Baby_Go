import React from 'react'
import {
  FaBars,
  FaFileAlt,
  FaCalendarAlt,
  FaHome
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface SidebarProps {
  isSidebarOpen: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  togglePin: () => void
}

interface SidebarItemProps {
  icon: React.ReactNode
  text: string
  to?: string
  onClick?: () => void
  isSidebarOpen: boolean
}

const SidebarLink: React.FC<SidebarItemProps> = ({
  icon,
  text,
  to,
  onClick,
  isSidebarOpen,
}) => {
  const content = (
    <div
      className="flex items-center p-4 transition-colors duration-200 text-white hover:bg-blue-800 cursor-pointer"
      onClick={onClick}
    >
      <div className="text-xl">{icon}</div>
      <span
        className={`
          ml-4 transition-opacity duration-200 whitespace-nowrap
          ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {text}
      </span>
    </div>
  )
  return to ? <Link to={to}>{content}</Link> : content
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  onMouseEnter,
  onMouseLeave,
  togglePin,
}) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full text-white transition-all duration-300 ease-in-out z-40
      ${isSidebarOpen ? 'w-64' : 'w-16'}`}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{
      backgroundColor: '#1e3766',
      fontFamily: "'Recoleta', serif"
    }}
>

      <div className="flex flex-col h-full justify-between">
        <div>
          <SidebarLink
            icon={<FaBars />}
            text=""
            isSidebarOpen={isSidebarOpen}
            onClick={togglePin}
          />
          
          <div className="mt-6">
            <SidebarLink
              icon={<FaHome/>}
              text="Menú"
              to="/Dashboard"
              isSidebarOpen={isSidebarOpen}
            />
            <SidebarLink
              icon={<FaCalendarAlt />}
              text="Eventos"
              to="/Eventos"
              isSidebarOpen={isSidebarOpen}
            />
            <SidebarLink
              icon={<FaFileAlt />}
              text="Formularios"
              to="/formularios"
              isSidebarOpen={isSidebarOpen}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

