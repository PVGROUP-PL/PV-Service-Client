// HomePage.jsx
import React, { useState, useEffect } from 'react';
import InstallerCard from './InstallerCard.jsx';
import API_URL from './apiConfig.js'; // Import adresu API z pliku konfiguracyjnego

function HomePage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Używamy zaimportowanego API_URL do zbudowania pełnego adresu zapytania
        const response = await fetch(`${API_URL}/api/profiles`);
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
    fetchProfiles();
  }, []);

  if (loading) return <p>Ładowanie listy instalatorów...</p>;
  if (error) return <p style={{ color: 'red' }}>Błąd: {error}</p>;

  return (
    <div>
      <h1>Znajdź instalatora w swojej okolicy</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {profiles.length > 0 ? (
          profiles.map(profile => (
            <InstallerCard key={profile.profile_id} profile={profile} />
          ))
        ) : (
          <p>Nie znaleziono żadnych profili instalatorów.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;