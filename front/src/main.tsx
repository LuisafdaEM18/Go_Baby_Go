import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home.tsx';  // Asegúrate de que sea Home.tsx
import IniciarSesion from './Pages/IniciarSesion.js';  // Asegúrate de que sea IniciarSesion.tsx
import Bienvenido from './Pages/Home.tsx';  // Asegúrate de que sea Bienvenido.tsx
import './App.css';

// No es necesario tipar `App` si no tiene props, pero puedes hacerlo explícito:
function App(): React.ReactElement {
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