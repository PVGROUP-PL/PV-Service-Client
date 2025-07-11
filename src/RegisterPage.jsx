import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from './apiConfig.js';

function RegisterPage() {
  const navigate = useNavigate();
  
  const [userType, setUserType] = useState('client'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('PL');
  
  const [isCompany, setIsCompany] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [nip, setNip] = useState('');

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [servicedBrands, setServicedBrands] = useState([]);
  const [basePostalCode, setBasePostalCode] = useState('');
  const [serviceRadius, setServiceRadius] = useState('');

  const countries = [
      { code: 'PL', name: 'Polska' },
      { code: 'DE', name: 'Niemcy' },
      { code: 'CZ', name: 'Czechy' },
      { code: 'SK', name: 'Słowacja' },
  ];

  const inverterBrands = [
    'Growatt', 'Afore', 'Fronius', 'SMA', 'Sofar Solar', 'FoxESS', 
    'ThinkPower', 'Solplanet', 'Huawei', 'Goodwe', 'Solis', 'SolarEdge', 
    'Enphase', 'Kostal', 'Sungrow', 'Victron Energy'
  ];

  const handleBrandChange = (event) => {
    const { name, checked } = event.target;
    let updatedBrands = [...servicedBrands];
    if (checked) {
      updatedBrands.push(name);
    } else {
      updatedBrands = updatedBrands.filter(brand => brand !== name);
    }
    setServicedBrands(updatedBrands);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Hasła nie są takie same.');
      return;
    }
    if (!termsAccepted) {
        setMessage('Musisz zaakceptować regulamin.');
        return;
    }
    setLoading(true);
    setMessage('');

    const registrationData = {
        email, password, user_type: userType,
        first_name: firstName, last_name: lastName, phone_number: phoneNumber,
        company_name: isCompany || userType === 'installer' ? companyName : null,
        nip: isCompany || userType === 'installer' ? nip : null,
        country_code: countryCode,
        serviced_inverter_brands: userType === 'installer' ? servicedBrands : [],
        base_postal_code: userType === 'installer' ? basePostalCode : null,
        service_radius_km: userType === 'installer' ? serviceRadius : null,
    };

    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registrationData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Wystąpił błąd.');
        setMessage('Rejestracja pomyślna! Za chwilę zostaniesz przekierowany do logowania.');
        setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
        setMessage(error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Utwórz nowe konto</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Wybierz typ konta:</h3>
        <label style={{ marginRight: '20px' }}>
            <input type="radio" value="client" checked={userType === 'client'} onChange={(e) => setUserType(e.target.value)} /> Jestem Klientem
        </label>
        <label>
            <input type="radio" value="installer" checked={userType === 'installer'} onChange={(e) => setUserType(e.target.value)} /> Jestem Instalatorem
        </label>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <fieldset style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <legend>Dane Podstawowe</legend>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Imię" required style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}/>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nazwisko" required style={{width: '100%', padding: '8px', boxSizing: 'border-box', marginTop: '10px'}}/>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Adres e-mail" required style={{width: '100%', padding: '8px', boxSizing: 'border-box', marginTop: '10px'}}/>
            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Numer telefonu" style={{width: '100%', padding: '8px', boxSizing: 'border-box', marginTop: '10px'}}/>
            <div style={{marginTop: '10px'}}>
                <label>Kraj rezydencji podatkowej:</label>
                <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}>
                    {countries.map(country => (<option key={country.code} value={country.code}>{country.name}</option>))}
                </select>
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Hasło" required style={{width: '100%', padding: '8px', boxSizing: 'border-box', marginTop: '10px'}}/>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Potwierdź hasło" required style={{width: '100%', padding: '8px', boxSizing: 'border-box', marginTop: '10px'}}/>
        </fieldset>

        {userType === 'client' && (
            <fieldset style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <legend>Dane Firmy (Opcjonalne)</legend>
                <label><input type="checkbox" checked={isCompany} onChange={(e) => setIsCompany(e.target.checked)} /> Rejestruję się jako firma</label>
                {isCompany && (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px'}}>
                        <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Nazwa firmy" style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}/>
                        <input value={nip} onChange={(e) => setNip(e.target.value)} placeholder="NIP" style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}/>
                    </div>
                )}
            </fieldset>
        )}

        {userType === 'installer' && (
             <>
                <fieldset style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <legend>Dane Firmy (Instalatora)</legend>
                    <p>Jako instalator musisz podać dane swojej działalności.</p>
                    <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Nazwa firmy / działalności" required style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}/>
                    <input value={nip} onChange={(e) => setNip(e.target.value)} placeholder="NIP" required style={{width: '100%', padding: '8px', boxSizing: 'border-box', marginTop: '10px'}}/>
                    <input value={basePostalCode} onChange={(e) => setBasePostalCode(e.target.value)} placeholder="Kod pocztowy siedziby (np. 00-001)" required style={{width: '100%', padding: '8px', boxSizing: 'border-box', marginTop: '10px'}}/>
                    <input type="number" value={serviceRadius} onChange={(e) => setServiceRadius(e.target.value)} placeholder="Zasięg usług w km (np. 100)" required style={{width: '100%', padding: '8px', boxSizing: 'border-box', marginTop: '10px'}}/>
                </fieldset>

                <fieldset style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <legend>Specjalizacje (Marki falowników)</legend>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                        {inverterBrands.sort().map(brand => (
                        <label key={brand} style={{display: 'block'}}>
                            <input 
                            type="checkbox"
                            name={brand}
                            checked={servicedBrands.includes(brand)}
                            onChange={handleBrandChange}
                            /> {brand}
                        </label>
                        ))}
                    </div>
                </fieldset>
             </>
        )}
        
        <div style={{ marginTop: '10px' }}><label><input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} /> Akceptuję regulamin serwisu.</label></div>
        
        {message && <p style={{ color: message.startsWith('Rejestracja') ? 'green' : 'red', textAlign: 'center' }}>{message}</p>}

        <button type="submit" disabled={loading} style={{ marginTop: '10px', width: '100%', padding: '15px', fontSize: '16px', fontWeight: 'bold' }}>
            {loading ? 'Rejestrowanie...' : 'Zarejestruj się'}
        </button>
      </form>

       <p style={{ marginTop: '20px', textAlign: 'center' }}>Masz już konto? <Link to="/login">Zaloguj się</Link></p>
    </div>
  );
}

export default RegisterPage;