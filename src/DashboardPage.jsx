import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx'; 
import API_URL from './apiConfig.js';

const StarRating = ({ rating, setRating }) => { /* ... treść komponentu bez zmian ... */ };

function DashboardPage() {
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  // ... reszta stanów bez zmian ...
  
  const fetchData = async () => {
    if (!token) return;
    console.log("Krok 2: Uruchamiam fetchData...");
    setLoading(true);
    setError('');
    try {
      const authHeaders = { 'Authorization': `Bearer ${token}` };
      
      console.log("Krok 3: Pobieram zlecenia (/api/requests/my-requests)");
      const requestsRes = await fetch(`${API_URL}/api/requests/my-requests`, { headers: authHeaders });
      console.log("Krok 4: Odpowiedź dla zleceń:", requestsRes.status, requestsRes.statusText);
      if (!requestsRes.ok) throw new Error('Nie udało się pobrać zleceń.');
      const requestsData = await requestsRes.json();
      setRequests(requestsData);

      if (user?.user_type === 'installer') {
        console.log("Krok 5: Jestem instalatorem, pobieram profil (/api/profiles/my-profile)");
        const profileRes = await fetch(`${API_URL}/api/profiles/my-profile`, { headers: authHeaders });
        console.log("Krok 6: Odpowiedź dla profilu:", profileRes.status, profileRes.statusText);
        
        if (profileRes.status === 404) {
          console.log("Krok 7a: Profil nie istnieje (404). Ustawiam profil na null.");
          setProfile(null);
        } else if (profileRes.ok) {
          const profileData = await profileRes.json();
          console.log("Krok 7b: Profil istnieje. Ustawiam dane profilu.");
          setProfile(profileData);
        } else {
          // Inny błąd niż 404
           throw new Error('Błąd podczas pobierania profilu instalatora.');
        }
      }
    } catch (err) {
      console.error("Krok X: Błąd w fetchData:", err);
      setError(err.message);
    } finally {
      console.log("Krok 8: Koniec fetchData, ustawiam loading na false.");
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Krok 1: Uruchamiam useEffect. authLoading:", authLoading);
    if (authLoading) return;
    if (!user || !token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [authLoading, user, token]);
  
  // ... reszta handlerów (handleUpdateStatus, etc.) bez zmian ...
  const handleUpdateStatus = async (requestId, newStatus) => { /* ... */ };
  const handleInitiateChat = async (recipientId) => { /* ... */ };
  const openReviewModal = (requestId) => { /* ... */ };
  const handleSendReview = async (e) => { /* ... */ };

  console.log("Stan przed renderowaniem:", { authLoading, loading, error, user, profile, requests });
  if (authLoading || loading) return <p style={{textAlign: 'center', marginTop: '50px'}}>Ładowanie panelu...</p>;
  if (!user) return null;

  const isRequestCompleted = (req) => { /* ... */ };

  return (
    <>
      {/* ... Modal bez zmian ... */}

      <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
        {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>Błąd: {error}</p>}
        
        {user.user_type === 'installer' && (
          <section>
            <h2>Mój Profil Instalatora</h2>
            {profile ? (
              <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                <h3>{profile.service_name}</h3>
                <p>{profile.service_description}</p>
                <Link to={`/edit-profile/${profile.profile_id}`}>Edytuj profil</Link>
              </div>
            ) : (
              <div>
                <p>Nie uzupełniłeś jeszcze swojego profilu instalatora.</p>
                <Link to="/create-profile">Uzupełnij profil teraz</Link>
              </div>
            )}
          </section>
        )}

        <section style={{ marginTop: '40px' }}>
          <h2>{user.user_type === 'installer' ? 'Zlecenia Serwisowe dla Ciebie' : 'Moje Zlecenia Serwisowe'}</h2>
          {requests.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {requests.map(req => (
                <li key={req.request_id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
                  {/* ... treść zlecenia bez zmian ... */}
                </li>
              ))}
            </ul>
          ) : (
            <p>Brak zleceń do wyświetlenia.</p>
          )}
        </section>
      </div>
    </>
  );
}

export default DashboardPage;