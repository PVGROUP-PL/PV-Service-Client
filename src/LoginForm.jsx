import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('Logowanie...');

    try {
      const response = await fetch('https://bookthefoodtruck-api.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- POPRAWIONA LOGIKA ---
        // Zapisujemy w pamięci zarówno token, jak i cały obiekt użytkownika
        localStorage.setItem('token', data.token);
        // data.user dostajemy z naszego API - zamieniamy obiekt na tekst (JSON)
        localStorage.setItem('user', JSON.stringify(data.user)); 

        // Po udanym logowaniu i zapisaniu danych, przekierowujemy na panel
        navigate('/dashboard');

      } else {
        setMessage(`Błąd: ${data.message}`);
      }
    } catch (error) {
      setMessage('Błąd sieci. Upewnij się, że serwer API jest uruchomiony.');
      console.error('Błąd połączenia z API:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Logowanie</h2>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Hasło:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Zaloguj</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default LoginForm;