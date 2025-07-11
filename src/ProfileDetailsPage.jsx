import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx'; 
import API_URL from './apiConfig.js'; // Poprawiony import

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
  
  const [preferred_date, setPreferredDate] = useState('');
  const [project_description, setProjectDescription] = useState('');
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    if (!profileId) {
        navigate('/');
        return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        // Używamy poprawnego API_URL
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
        const response = await fetch(`${API_URL}/api/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                profile_id: parseInt(profileId),
                preferred_date,
                project_description
            })
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
    galleryImage: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }
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
              <img key={index} src={`${API_URL}${url}`} alt={`Realizacja ${index + 1}`} style={styles.galleryImage} />
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
            <form onSubmit={handleRequestSubmit}>
                 <div>
                    <label>Preferowana data usługi:</label>
                    <input type="date" value={preferred_date} onChange={e => setPreferredDate(e.target.value)} required />
                </div>
                <div>
                    <label>Opis problemu / zlecenia:</label>
                    <textarea value={project_description} onChange={e => setProjectDescription(e.target.value)} required />
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