import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx'; 
import API_URL from './apiConfig.js'; // Używamy centralnej konfiguracji

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login({
            userId: data.userId,
            email: data.email,
            user_type: data.user_type
        }, data.token);
        
        navigate(from, { replace: true });
      } else {
        setLoading(false);
        setMessage(data.message || 'Wystąpił nieznany błąd.');
      }
    } catch (error) {
      setLoading(false);
      setMessage('Błąd sieci. Nie można połączyć się z serwerem.');
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '50px auto', padding: '30px' }}>
      <h2 style={{ textAlign: 'center' }}>Zaloguj się</h2>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Hasło" required />
        <button type="submit" disabled={loading}>
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
}

export default LoginPage;