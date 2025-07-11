import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API_URL from './apiConfig.js'; // Poprawiony import

function BookingPage() {
  const { profileId } = useParams(); // Zmiana z truckId na profileId dla spójności
  const navigate = useNavigate();

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
      // Używamy poprawnego adresu API i endpointu dla zleceń
      const response = await fetch(`${API_URL}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          profile_id: parseInt(profileId),
          project_description: event_details,
          preferred_date: event_date,
          // Dodaj inne potrzebne pola, jeśli API ich wymaga
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Twoja prośba o zlecenie została wysłana!');
        navigate('/dashboard');
      } else {
        setMessage(`Błąd: ${data.message}`);
      }
    } catch (error) {
      setMessage('Błąd sieci.');
      console.error('Błąd podczas wysyłania zlecenia:', error);
    }
  };

  return (
    <div>
      <nav style={{ padding: '1rem' }}>
        <Link to={`/profile/${profileId}`}>Powrót do profilu instalatora</Link>
      </nav>
      <h1>Zlecenie usługi serwisowej</h1>
      <p>Proszę wypełnić szczegóły Twojego zlecenia.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Preferowana data usługi:</label>
          <input type="date" value={event_date} onChange={e => setEventDate(e.target.value)} required />
        </div>
        <div>
          <label>Adres, gdzie ma być wykonana usługa:</label>
          <input type="text" value={event_address} onChange={e => setEventAddress(e.target.value)} required />
        </div>
        <div>
          <label>Kod pocztowy:</label>
          <input type="text" value={event_postal_code} onChange={e => setEventPostalCode(e.target.value)} />
        </div>
        <div>
          <label>Opis problemu / zlecenia:</label>
          <textarea value={event_details} onChange={e => setEventDetails(e.target.value)} required />
        </div>
        <button type="submit">Wyślij zapytanie o usługę</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default BookingPage;