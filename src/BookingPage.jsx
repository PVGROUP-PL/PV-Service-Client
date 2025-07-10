import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function BookingPage() {
  const { truckId } = useParams(); // Pobieramy ID food trucka z adresu URL
  const navigate = useNavigate(); // Do przekierowania po sukcesie

  // Stany dla pól formularza
  const [event_details, setEventDetails] = useState('');
  const [event_date, setEventDate] = useState('');
  const [event_address, setEventAddress] = useState('');
  const [event_postal_code, setEventPostalCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('Wysyłanie prośby o rezerwację...');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Musisz być zalogowany, aby dokonać rezerwacji.');
      return;
    }

    try {
      const response = await fetch('https://bookthefoodtruck-api.onrender.com/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          truck_id: parseInt(truckId), // Upewniamy się, że ID jest liczbą
          event_details,
          event_date,
          event_address,
          event_postal_code,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Twoja prośba o rezerwację została wysłana!');
        navigate('/dashboard'); // Przekieruj na panel po udanej rezerwacji
      } else {
        setMessage(`Błąd: ${data.message}`);
      }
    } catch (error) {
      setMessage('Błąd sieci.');
      console.error('Błąd podczas wysyłania rezerwacji:', error);
    }
  };

  return (
    <div>
      <nav style={{ padding: '1rem' }}>
        <Link to={`/trucks/${truckId}`}>Powrót do szczegółów food trucka</Link>
      </nav>
      <h1>Rezerwacja Food Trucka</h1>
      <p>Proszę wypełnić szczegóły Twojego wydarzenia.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Data wydarzenia:</label>
          <input type="date" value={event_date} onChange={e => setEventDate(e.target.value)} required />
        </div>
        <div>
          <label>Adres wydarzenia:</label>
          <input type="text" value={event_address} onChange={e => setEventAddress(e.target.value)} required />
        </div>
        <div>
          <label>Kod pocztowy wydarzenia:</label>
          <input type="text" value={event_postal_code} onChange={e => setEventPostalCode(e.target.value)} />
        </div>
        <div>
          <label>Opis wydarzenia (np. liczba gości, charakter imprezy):</label>
          <textarea value={event_details} onChange={e => setEventDetails(e.target.value)} required />
        </div>
        <button type="submit">Wyślij prośbę o rezerwację</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default BookingPage;
