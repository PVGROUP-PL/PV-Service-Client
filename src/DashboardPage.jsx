import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx'; 
import API_URL from './apiConfig.js';

// Komponent gwiazdek do oceny
const StarRating = ({ rating, setRating }) => {
    return (
        <div>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    style={{ cursor: 'pointer', color: star <= rating ? 'gold' : 'grey', fontSize: '2rem' }}
                    onClick={() => setRating(star)}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

function DashboardPage() {
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const authHeaders = { 'Authorization': `Bearer ${token}` };
      
      const requestsRes = await fetch(`${API_URL}/api/requests/my-requests`, { headers: authHeaders });
      if (!requestsRes.ok) {
        throw new Error('Nie udało się pobrać zleceń.');
      }
      const requestsData = await requestsRes.json();
      setRequests(requestsData);

      if (user?.user_type === 'installer') {
        const profileRes = await fetch(`${API_URL}/api/profiles/my-profile`, { headers: authHeaders });
        if (profileRes.status !== 404 && profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        } else {
          setProfile(null);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error("Błąd pobierania danych w panelu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [authLoading, user, token, navigate]);

  const handleUpdateStatus = async (requestId, newStatus) => {
    setError('');
    try {
        const response = await fetch(`${API_URL}/api/requests/${requestId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify({ status: newStatus })
        });
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || `Nie udało się zmienić statusu zlecenia.`);
        }
        fetchData(); 
    } catch (err) {
        setError(err.message);
    }
  };

  const handleInitiateChat = async (recipientId) => {
    if (!recipientId) { setError("Brak ID odbiorcy do rozpoczęcia czatu."); return; }
    try {
        const response = await fetch(`${API_URL}/api/conversations/initiate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify({ recipientId })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Błąd inicjowania rozmowy");
        navigate(`/chat/${data.conversation_id}`);
    } catch(err) {
        setError(`Nie można rozpocząć czatu: ${err.message}`);
    }
  };

  const openReviewModal = (requestId) => {
    setCurrentRequestId(requestId);
    setIsReviewModalOpen(true);
  };
  
  const handleSendReview = async (e) => {
    e.preventDefault();
    setError('');
    if (rating === 0) { setError("Ocena musi wynosić od 1 do 5 gwiazdek."); return; }
    try {
        const response = await fetch(`${API_URL}/api/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                request_id: currentRequestId,
                rating: rating,
                comment: comment
            })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Nie udało się dodać opinii.');

        alert("Dziękujemy za wystawienie opinii!");
        setIsReviewModalOpen(false);
        setRating(0); 
        setComment('');
        fetchData();
    } catch (err) {
        setError(err.message);
    }
  };

  if (authLoading || loading) return <p style={{textAlign: 'center', marginTop: '50px'}}>Ładowanie panelu...</p>;
  if (!user) return null;

  const isRequestCompleted = (req) => {
    const eventDate = req.preferred_date || req.event_date;
    return new Date(eventDate) < new Date() && req.status === 'confirmed';
  }

  return (
    <>
      {isReviewModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '5px', width: '400px' }}>
            <h2>Wystaw opinię</h2>
            <form onSubmit={handleSendReview}>
              <p>Oceń usługę (1-5):</p>
              <StarRating rating={rating} setRating={setRating} />
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Napisz kilka słów komentarza..."
                style={{ width: '100%', height: '100px', marginTop: '15px', boxSizing: 'border-box' }}
              />
              <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsReviewModalOpen(false)}>Anuluj</button>
                <button type="submit">Wyślij opinię</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  
                  {user.user_type === 'installer' ? (
                    <div>
                      <p><strong>Zleceniodawca:</strong> {req.client_first_name} {req.client_last_name} ({req.client_email})</p>
                      <p><strong>Telefon klienta:</strong> {req.client_phone}</p>
                    </div>
                  ) : (
                    <p><strong>Nazwa usługi / firmy:</strong> {req.service_name}</p>
                  )}
                  <hr style={{margin: '10px 0'}} />
          
                  <p><strong>Preferowana data:</strong> {new Date(req.preferred_date).toLocaleDateString()}</p>
                  <p><strong>Opis problemu:</strong> {req.project_description}</p>
                  <p><strong>Pilność:</strong> {req.urgency}</p>
                  
                  <div style={{background: '#f9f9f9', padding: '10px', marginTop: '10px', borderRadius: '5px'}}>
                      <h4 style={{marginTop: 0}}>Szczegóły instalacji klienta</h4>
                      <p><strong>Typ instalacji:</strong> {req.installation_type}</p>
                      <p><strong>Typ systemu:</strong> {req.system_type}</p>
                      <p><strong>Falownik:</strong> {req.inverter_brand_model}</p>
                      <p><strong>Wiek instalacji:</strong> {req.installation_age_years} lat</p>
                      {req.error_codes && <p><strong>Kody błędów:</strong> {req.error_codes}</p>}
                  </div>
                  
                  <p style={{marginTop: '15px'}}><strong>Status zlecenia:</strong> {req.status}</p>
                  
                  <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {user.user_type === 'installer' && req.status === 'pending_installer_approval' && (
                      <>
                        <button onClick={() => handleUpdateStatus(req.request_id, 'confirmed')} style={{backgroundColor: 'green', color: 'white'}}>Akceptuj</button>
                        <button onClick={() => handleUpdateStatus(req.request_id, 'rejected_by_installer')} style={{backgroundColor: 'red', color: 'white'}}>Odrzuć</button>
                      </>
                    )}
                    {user.user_type === 'installer' && req.status === 'confirmed' && (
                       <p style={{color: 'blue', fontWeight: 'bold'}}>Zaakceptowano!</p>
                    )}
                    {user.user_type === 'installer' ? (
                      <button onClick={() => handleInitiateChat(req.client_id)}>Skontaktuj się z klientem</button>
                    ) : (
                      <button onClick={() => handleInitiateChat(req.installer_id)}>Skontaktuj się z instalatorem</button>
                    )}
                    {user.user_type === 'client' && isRequestCompleted(req) && (
                        <button onClick={() => openReviewModal(req.request_id)} style={{backgroundColor: '#007bff', color: 'white'}}>Wystaw opinię</button>
                    )}
                  </div>
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