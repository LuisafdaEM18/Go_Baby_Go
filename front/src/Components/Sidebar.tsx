import React, { useState } from 'react'
import {
  FaBars,
  FaFileAlt,
  FaCalendarAlt,
  FaHome,
  FaChevronDown,
  FaChevronRight,
  FaPlus,
  FaCog
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
  children?: React.ReactNode
  isExpandable?: boolean
  isExpanded?: boolean
}

const SidebarLink: React.FC<SidebarItemProps> = ({
  icon,
  text,
  to,
  onClick,
  isSidebarOpen,
  children,
  isExpandable = false,
  isExpanded = false
}) => {
  const content = (
    <div
      className="flex items-center justify-between p-4 transition-colors duration-200 text-white hover:bg-blue-800 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center">
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
      {isExpandable && isSidebarOpen && (
        <div className="text-sm">
          {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
        </div>
      )}
    </div>
  )

  const element = to ? <Link to={to}>{content}</Link> : content

  return (
    <div>
      {element}
      {children && isExpanded && isSidebarOpen && (
        <div className="bg-blue-900 bg-opacity-50">
          {children}
        </div>
      )}
    </div>
  )
}

interface SubMenuItemProps {
  icon: React.ReactNode
  text: string
  to: string
  isSidebarOpen: boolean
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({ icon, text, to, isSidebarOpen }) => {
  return (
    <Link to={to}>
      <div className="flex items-center pl-12 pr-4 py-3 transition-colors duration-200 text-white hover:bg-blue-700 cursor-pointer">
        <div className="text-sm">{icon}</div>
        <span
          className={`
            ml-3 transition-opacity duration-200 whitespace-nowrap text-sm
            ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {text}
        </span>
      </div>
    </Link>
  )
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  onMouseEnter,
  onMouseLeave,
  togglePin,
}) => {
  const [eventosExpanded, setEventosExpanded] = useState(false)
  const [formulariosExpanded, setFormulariosExpanded] = useState(false)

  const toggleEventos = () => {
    setEventosExpanded(!eventosExpanded)
  }

  const toggleFormularios = () => {
    setFormulariosExpanded(!formulariosExpanded)
  }

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
              icon={<FaHome />}
              text="Dashboard"
              to="/dashboard"
              isSidebarOpen={isSidebarOpen}
            />
            <SidebarLink
              icon={<FaFileAlt />}
              text="Formularios"
              isSidebarOpen={isSidebarOpen}
              isExpandable={true}
              isExpanded={formulariosExpanded}
              onClick={toggleFormularios}
            >
              <SubMenuItem
                icon={<FaPlus />}
                text="Crear Formulario"
                to="/formularios/crear"
                isSidebarOpen={isSidebarOpen}
              />
              <SubMenuItem
                icon={<FaCog />}
                text="Gestionar Formularios"
                to="/formularios/gestionar"
                isSidebarOpen={isSidebarOpen}
              />
            </SidebarLink>
                      
            <SidebarLink
              icon={<FaCalendarAlt />}
              text="Eventos"
              isSidebarOpen={isSidebarOpen}
              isExpandable={true}
              isExpanded={eventosExpanded}
              onClick={toggleEventos}
            >
              <SubMenuItem
                icon={<FaPlus />}
                text="Crear Evento"
                to="/eventos/crear"
                isSidebarOpen={isSidebarOpen}
              />
              <SubMenuItem
                icon={<FaCog />}
                text="Gestionar Eventos"
                to="/eventos/gestionar"
                isSidebarOpen={isSidebarOpen}
              />
            </SidebarLink>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

