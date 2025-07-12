import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx'; 
import { API_URL, DIRECT_BACKEND_URL } from './apiConfig.js';

const StarRatingDisplay = ({ rating }) => {
    const totalStars = 5;
    let stars = [];
    for (let i = 1; i <= totalStars; i++) {
        stars.push(
            <span key={i} style={{ color: i <= rating ? 'gold' : 'grey', fontSize: '1.5rem' }}>
                ★
            </span>
        );
    }
    return <div>{stars}</div>;
};

function ProfileDetailsPage() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Stany dla nowego, rozbudowanego formularza zlecenia
  const [preferred_date, setPreferredDate] = useState('');
  const [project_description, setProjectDescription] = useState('');
  const [installation_type, setInstallationType] = useState('dachowa');
  const [system_type, setSystemType] = useState('on-grid');
  const [inverter_brand_model, setInverterBrandModel] = useState('');
  const [installation_age_years, setInstallationAge] = useState('');
  const [urgency, setUrgency] = useState('standardowa');
  const [error_codes, setErrorCodes] = useState('');
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    if (!profileId) {
        navigate('/');
        return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, reviewsRes] = await Promise.all([
          fetch(`${API_URL}/api/profiles/${profileId}`),
          fetch(`${API_URL}/api/reviews/profile/${profileId}`)
        ]);

        if (!profileRes.ok) throw new Error('Nie znaleziono profilu instalatora.');
        const profileData = await profileRes.json();
        setProfile(profileData);

        if (reviewsRes.ok) {
            const reviewsData = await reviewsRes.json();
            setReviews(reviewsData);
            if (reviewsData.length > 0) {
                const totalRating = reviewsData.reduce((acc, review) => acc + review.rating, 0);
                setAverageRating(totalRating / reviewsData.length);
            }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profileId, navigate]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!token || !user) {
        setRequestMessage("Musisz być zalogowany, aby wysłać zapytanie.");
        return;
    }
    if (user.user_type === 'installer') {
        setRequestMessage("Instalatorzy nie mogą wysyłać zapytań o usługę.");
        return;
    }
    setRequestMessage('Wysyłanie zapytania...');
    try {
        const body = {
            profile_id: parseInt(profileId),
            preferred_date,
            project_description,
            installation_type,
            system_type,
            inverter_brand_model,
            installation_age_years,
            urgency,
            error_codes
        };
        const response = await fetch(`${API_URL}/api/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Nie udało się wysłać zapytania.");
        }
        setRequestMessage("Zapytanie wysłane pomyślnie! Instalator wkrótce się z Tobą skontaktuje.");
    } catch (err) {
        setRequestMessage(`Błąd: ${err.message}`);
    }
  };
  
  const styles = {
    section: { marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' },
    gallery: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' },
    galleryImage: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' },
    form: { display: 'flex', flexDirection: 'column', gap: '10px' },
    formLabel: { fontWeight: 'bold', marginBottom: '-5px' },
    formInput: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }
  };

  if (loading) return <p>Ładowanie danych instalatora...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!profile) return <p>Nie znaleziono tego instalatora.</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px' }}>
      <h1>{profile.service_name}</h1>
      <p>{profile.service_description}</p>
      {profile.website_url && <p><strong>Strona WWW:</strong> <a href={profile.website_url} target="_blank" rel="noopener noreferrer">{profile.website_url}</a></p>}

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
        <StarRatingDisplay rating={averageRating} />
        <span>({averageRating.toFixed(2)} / 5 na podstawie {reviews.length} opinii)</span>
      </div>
      
      <section style={styles.section}>
        <h3>Kluczowe informacje</h3>
        <ul>
            <li><strong>Doświadczenie w branży:</strong> {profile.experience_years || 'Nie podano'} lat</li>
            <li><strong>Obszar działania:</strong> Do {profile.service_radius_km || 'N/A'} km od {profile.base_postal_code || 'N/A'}</li>
            <li><strong>Certyfikaty:</strong> {profile.certifications || 'Nie podano'}</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h3>Rodzaje świadczonych usług</h3>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
            {profile.service_types?.map(type => <span key={type} style={{background: '#e9e9e9', padding: '5px 10px', borderRadius: '15px'}}>{type}</span>) || <p>Nie podano.</p>}
        </div>
      </section>

       <section style={styles.section}>
        <h3>Obsługiwani producenci falowników</h3>
         <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
            {profile.serviced_inverter_brands?.map(brand => <span key={brand} style={{background: '#e9e9e9', padding: '5px 10px', borderRadius: '15px'}}>{brand}</span>) || <p>Nie podano.</p>}
        </div>
      </section>

      <section style={styles.section}>
        <h2>Galeria realizacji</h2>
        {profile.reference_photo_urls && profile.reference_photo_urls.length > 0 ? (
          <div style={styles.gallery}>
            {profile.reference_photo_urls.map((url, index) => (
              <img key={index} src={url} alt={`Realizacja ${index + 1}`} style={styles.galleryImage} />
            ))}
          </div>
        ) : (
          <p>Instalator nie dodał jeszcze zdjęć ze swoich realizacji.</p>
        )}
      </section>

      <section style={styles.section}>
        <h2>Opinie</h2>
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.review_id} style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
              <StarRatingDisplay rating={review.rating} />
              <p style={{ fontStyle: 'italic', marginTop: '5px' }}>"{review.comment}"</p>
              <small>– {review.first_name}, {new Date(review.created_at).toLocaleDateString()}</small>
            </div>
          ))
        ) : (
          <p>Ten instalator nie ma jeszcze żadnych opinii.</p>
        )}
      </section>

      <section style={styles.section}>
      {user && (user.user_type === 'client') ? (
        <div>
            <h2>Wyślij zapytanie o usługę</h2>
            <p>Twoje dane kontaktowe (telefon) zostaną automatycznie dołączone do zapytania.</p>
            <form onSubmit={handleRequestSubmit} style={styles.form}>
                <div>
                    <label style={styles.formLabel}>Preferowana data usługi:</label>
                    <input type="date" value={preferred_date} onChange={e => setPreferredDate(e.target.value)} required style={styles.formInput} />
                </div>
                 <div>
                    <label style={styles.formLabel}>Typ instalacji:</label>
                    <select value={installation_type} onChange={e => setInstallationType(e.target.value)} style={styles.formInput}>
                        <option value="dachowa">Dachowa</option>
                        <option value="gruntowa">Gruntowa</option>
                    </select>
                </div>
                 <div>
                    <label style={styles.formLabel}>Typ systemu:</label>
                    <select value={system_type} onChange={e => setSystemType(e.target.value)} style={styles.formInput}>
                        <option value="on-grid">Sieciowa (On-grid)</option>
                        <option value="hybrid">Hybrydowa z magazynem</option>
                        <option value="off-grid">Wyspowa (Off-grid)</option>
                    </select>
                </div>
                <div>
                    <label style={styles.formLabel}>Marka i model falownika:</label>
                    <input type="text" value={inverter_brand_model} onChange={e => setInverterBrandModel(e.target.value)} placeholder="np. Fronius Symo 10.0-3-M" required style={styles.formInput} />
                </div>
                <div>
                    <label style={styles.formLabel}>Wiek instalacji (w latach):</label>
                    <input type="number" value={installation_age_years} onChange={e => setInstallationAge(e.target.value)} placeholder="np. 3" required style={styles.formInput} />
                </div>
                 <div>
                    <label style={styles.formLabel}>Pilność:</label>
                    <select value={urgency} onChange={e => setUrgency(e.target.value)} style={styles.formInput}>
                        <option value="standardowa">Standardowa</option>
                        <option value="pilne">Pilne (awaria)</option>
                    </select>
                </div>
                <div>
                    <label style={styles.formLabel}>Kody błędów wyświetlane na falowniku (jeśli są):</label>
                    <input type="text" value={error_codes} onChange={e => setErrorCodes(e.target.value)} placeholder="np. State 401" style={styles.formInput} />
                </div>
                <div>
                    <label style={styles.formLabel}>Opis problemu / zlecenia:</label>
                    <textarea value={project_description} onChange={e => setProjectDescription(e.target.value)} placeholder="Opisz jak najdokładniej, co się dzieje." required style={{...styles.formInput, minHeight: '100px'}} />
                </div>
                <button type="submit">Wyślij zapytanie</button>
            </form>
            {requestMessage && <p>{requestMessage}</p>}
        </div>
      ) : (
        <p>
            {user ? (user.user_type === 'installer' ? 'Jako instalator nie możesz wysyłać zapytań.' : '') : <Link to="/login" state={{ from: location }}>Zaloguj się</Link>}
            {!user && ', aby wysłać zapytanie o usługę.'}
        </p>
      )}
      </section>
    </div>
  );
}

export default ProfileDetailsPage;