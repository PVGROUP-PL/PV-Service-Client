import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://bookthefoodtruck-api.onrender.com'
  : 'http://localhost:3000';

// Definicje opcji do wyboru w formularzu
const INVERTER_BRANDS = ["Growatt", "Afore", "Solis", "Sofar Solar", "FoxESS", "Solplanet", "Fronius", "SMA", "Goodwe", "Inne"];
const SERVICE_TYPES = ["Serwis i diagnostyka", "Montaż nowych instalacji", "Przeglądy okresowe", "Modernizacja instalacji"];

function CreateProfilePage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Stany dla wszystkich pól formularza
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [radius, setRadius] = useState('');
  const [experience, setExperience] = useState('');
  const [website, setWebsite] = useState('');
  const [certifications, setCertifications] = useState('');
  const [servicedBrands, setServicedBrands] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [photos, setPhotos] = useState(null);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Funkcja do obsługi checkboxów (wybór wielokrotny)
  const handleCheckboxChange = (e, state, setState) => {
    const { value, checked } = e.target;
    if (checked) {
      setState([...state, value]);
    } else {
      setState(state.filter((item) => item !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Tworzymy obiekt FormData, ponieważ wysyłamy pliki
    const formData = new FormData();
    formData.append('service_name', serviceName);
    formData.append('service_description', description);
    formData.append('base_postal_code', postalCode);
    formData.append('service_radius_km', radius);
    formData.append('experience_years', experience);
    formData.append('website_url', website);
    formData.append('certifications', certifications);
    
    // Dodajemy tablice jako listy stringów
    formData.append('serviced_inverter_brands', JSON.stringify(servicedBrands));
    formData.append('service_types', JSON.stringify(serviceTypes));

    // Dodajemy wszystkie wybrane zdjęcia
    if (photos) {
      for (let i = 0; i < photos.length; i++) {
        formData.append('reference_photos', photos[i]);
      }
    }

    try {
      const response = await fetch(`${API_URL}/api/profiles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // WAŻNE: Nie ustawiamy 'Content-Type', przeglądarka zrobi to sama dla FormData
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Wystąpił błąd podczas tworzenia profilu.');
      }

      setMessage('Profil został pomyślnie utworzony! Zaraz zostaniesz przekierowany do panelu.');
      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Proste style dla czytelności
  const styles = {
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { width: '100%', padding: '8px', boxSizing: 'border-box' },
    fieldset: { border: '1px solid #ccc', padding: '15px', borderRadius: '5px' },
    checkboxGroup: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  };

  return (
    <div style={{ maxWidth: '700px', margin: '20px auto', padding: '20px' }}>
      <h1>Utwórz Swój Profil Instalatora</h1>
      <p>Uzupełnij poniższe informacje, aby klienci mogli Cię znaleźć.</p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <fieldset style={styles.fieldset}>
          <legend>Podstawowe informacje</legend>
          <input value={serviceName} onChange={(e) => setServiceName(e.target.value)} placeholder="Nazwa firmy / Imię i nazwisko" required style={styles.input} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Krótki opis Twojej działalności, doświadczenia..." required style={{...styles.input, minHeight: '100px', marginTop: '10px'}} />
          <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Adres strony internetowej (opcjonalnie)" style={{...styles.input, marginTop: '10px'}} />
        </fieldset>

        <fieldset style={styles.fieldset}>
          <legend>Obszar działania</legend>
          <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Główny kod pocztowy (np. 00-001)" required style={styles.input} />
          <input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="Promień działania w km (np. 100)" required style={{...styles.input, marginTop: '10px'}} />
        </fieldset>

        <fieldset style={styles.fieldset}>
          <legend>Kompetencje i Doświadczenie</legend>
          <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Lata doświadczenia w branży" required style={styles.input} />
          <textarea value={certifications} onChange={(e) => setCertifications(e.target.value)} placeholder="Posiadane certyfikaty i uprawnienia (opcjonalnie)" style={{...styles.input, minHeight: '80px', marginTop: '10px'}} />
          
          <p style={{marginTop: '15px', marginBottom: '5px'}}>Obsługiwani producenci falowników:</p>
          <div style={styles.checkboxGroup}>
            {INVERTER_BRANDS.map(brand => (
              <label key={brand}><input type="checkbox" value={brand} onChange={(e) => handleCheckboxChange(e, servicedBrands, setServicedBrands)} /> {brand}</label>
            ))}
          </div>

          <p style={{marginTop: '15px', marginBottom: '5px'}}>Rodzaje świadczonych usług:</p>
           <div style={styles.checkboxGroup}>
            {SERVICE_TYPES.map(type => (
              <label key={type}><input type="checkbox" value={type} onChange={(e) => handleCheckboxChange(e, serviceTypes, setServiceTypes)} /> {type}</label>
            ))}
          </div>
        </fieldset>
        
        <fieldset style={styles.fieldset}>
            <legend>Galeria Zdjęć (max 10)</legend>
            <input type="file" multiple accept="image/*" onChange={(e) => setPhotos(e.target.files)} style={styles.input} />
        </fieldset>

        {message && <p style={{ color: message.startsWith('Profil') ? 'green' : 'red', textAlign: 'center' }}>{message}</p>}

        <button type="submit" disabled={loading} style={{ padding: '15px', fontSize: '16px', fontWeight: 'bold' }}>
          {loading ? 'Tworzenie profilu...' : 'Utwórz profil'}
        </button>
      </form>
    </div>
  );
}

export default CreateProfilePage;