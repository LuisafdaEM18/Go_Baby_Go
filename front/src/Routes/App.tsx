import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Dashboard from '../Pages/Dashboard';
import CrearEventos from '../Pages/CrearEventos';
import GestionarEventos from '../Pages/GestionarEventos';
import CrearFormularios from '../Pages/CrearFormularios';
import GestionarFormularios from '../Pages/GestionarFormularios';
import EditarEvento from '../Pages/EditarEvento';
import RegistroVoluntario from '../Pages/RegistroVoluntario';
import EditarFormulario from '../Pages/EditarFormulario';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../Components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/voluntario/registro/:id" element={<RegistroVoluntario />} />
          
          {/* Protected admin routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/eventos/crear" element={
            <ProtectedRoute>
              <CrearEventos />
            </ProtectedRoute>
          } />
          
          <Route path="/eventos/gestionar" element={
            <ProtectedRoute>
              <GestionarEventos />
            </ProtectedRoute>
          } />
          
          <Route path="/eventos/editar/:id" element={
            <ProtectedRoute>
              <EditarEvento />
            </ProtectedRoute>
          } />
          
          <Route path="/formularios/crear" element={
            <ProtectedRoute>
              <CrearFormularios />
            </ProtectedRoute>
          } />
          
          <Route path="/formularios/gestionar" element={
            <ProtectedRoute>
              <GestionarFormularios />
            </ProtectedRoute>
          } />
          
          <Route path="/formularios/editar/:id" element={
            <ProtectedRoute>
              <EditarFormulario />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;