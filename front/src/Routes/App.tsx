import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Dashboard from '../Pages/Dashboard';
import Eventos from '../Pages/Eventos';
import CrearEventos from '../Pages/CrearEventos';
import GestionarEventos from '../Pages/GestionarEventos';
import Formularios from '../Pages/Formularios';
import CrearFormularios from '../Pages/CrearFormularios';
import GestionarFormularios from '../Pages/GestionarFormularios';
import EditarEvento from '../Pages/EditarEvento';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/eventos/crear" element={<CrearEventos />}/>
        <Route path="/eventos/gestionar" element={<GestionarEventos />}/>
        <Route path="/eventos/editar/:id" element={<EditarEvento />} />
        <Route path="/forms" element={<Formularios />} />
        <Route path="/formularios/crear" element={<CrearFormularios />} />
        <Route path="/formularios/gestionar" element={<GestionarFormularios />} />
      </Routes>
    </Router>
  );
};

export default App;