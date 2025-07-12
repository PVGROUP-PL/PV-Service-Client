// HomePage.jsx
import React, { useState, useEffect } from 'react';
import InstallerCard from './InstallerCard.jsx';
import API_URL from './apiConfig.js';

// Lista specjalizacji do wyboru w filtrze
const ALL_SPECIALIZATIONS = ["Serwis i diagnostyka", "Montaż nowych instalacji", "Przeglądy okresowe", "Modernizacja instalacji"];

function HomePage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Stany dla naszych filtrów
  const [postalCode, setPostalCode] = useState('');
  const [specialization, setSpecialization] = useState('');

  // Funkcja pobierająca dane, teraz z obsługą filtrów
  const fetchProfiles = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      // Budujemy query string na podstawie filtrów
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_URL}/api/profiles?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Nie udało się pobrać danych.');
      }
      const data = await response.json();
      setProfiles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Pobieramy wszystkich przy pierwszym ładowaniu strony
  useEffect(() => {
    fetchProfiles();
  }, []);

  // Handler do wyszukiwania po kliknięciu przycisku
  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {};
    if (specialization) filters.specialization = specialization;
    if (postalCode) filters.postal_code = postalCode;
    fetchProfiles(filters);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Znajdź instalatora w swojej okolicy</h1>

      {/* Formularz z filtrami */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px', marginBottom: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
        <select value={specialization} onChange={e => setSpecialization(e.target.value)} style={{ padding: '10px' }}>
          <option value="">Wybierz specjalizację...</option>
          {ALL_SPECIALIZATIONS.map(spec => <option key={spec} value={spec}>{spec}</option>)}
        </select>
        <input 
          type="text" 
          value={postalCode}
          onChange={e => setPostalCode(e.target.value)}
          placeholder="Wpisz kod pocztowy..."
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Szukaj</button>
      </form>

      {/* Wyświetlanie wyników */}
      {loading && <p>Ładowanie listy instalatorów...</p>}
      {error && <p style={{ color: 'red' }}>Błąd: {error}</p>}
      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {profiles.length > 0 ? (
            profiles.map(profile => (
              <InstallerCard key={profile.profile_id} profile={profile} />
            ))
          ) : (
            <p>Nie znaleziono żadnych profili instalatorów spełniających Twoje kryteria.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;