import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Dashboard from '../Pages/Dashboard';
import Eventos from '../Pages/Eventos';
import CrearEventos from '../Pages/CrearEventos';
import GestionarEventos from '../Pages/GestionarEventos';

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
      </Routes>
    </Router>
  );
};

export default App;