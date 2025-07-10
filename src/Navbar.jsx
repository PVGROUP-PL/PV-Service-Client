import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// POPRAWKA: Poprawiono ścieżkę do AuthContext
import { AuthContext } from './AuthContext.jsx';

function Navbar() {
  // Pobieramy dane i funkcje z naszego globalnego kontekstu
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Wywołujemy funkcję wylogowania z kontekstu
    navigate('/'); // Przekierowujemy na stronę główną
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
      height: '60px',
      background: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
    }}>
      <div>
        <Link to="/" style={{ textDecoration: 'none', color: '#333', fontSize: '1.5em', fontWeight: 'bold' }}>
          BookTheTruck
        </Link>
      </div>
      <div>
        {user ? (
          // Widok, gdy użytkownik jest zalogowany
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>
              Witaj, <strong>{user.email}</strong> (Rola: {user.user_type})
            </span>
            <Link to="/dashboard">Mój Panel</Link>
            <button onClick={handleLogout}>Wyloguj</button>
          </div>
        ) : (
          // Widok, gdy użytkownik nie jest zalogowany
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/login">Zaloguj się</Link>
            <Link to="/register">Zarejestruj się</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
