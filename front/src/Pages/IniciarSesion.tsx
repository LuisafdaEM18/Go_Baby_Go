import { useState } from 'react';
import '../Pages/styles/IniciarSesion.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate(); // <-- Declara navigate aquí

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para manejar el inicio de sesión
    console.log('Usuario:', usuario, 'Contraseña:', contrasena);
    navigate('/bienvenido');
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <h1>El Comité</h1>
      </header>
      
      <main className="login-main">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>
          
          <div className="form-actions">
            <Link to= "/bienvenido" className="btn ingresar">Ingresar</Link>
            <Link to="/" className="btn regresar">Regresar</Link>
          </div>
          
          <div className="forgot-password">
            <Link to="/recuperar">¿Olvidaste la contraseña?</Link>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;