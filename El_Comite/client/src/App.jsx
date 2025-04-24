import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Home from './Pages/Home';  // Ruta relativa correcta
import IniciarSesion from './Pages/IniciarSesion';
import Bienvenido from './Pages/Bienvenido';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<IniciarSesion />} />
        <Route path="/bienvenido" element={<Bienvenido />} />
      </Routes>
    </Router>
  );
}

export default App;