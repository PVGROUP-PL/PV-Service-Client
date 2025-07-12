// InstallerCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Mały komponent do wyświetlania gwiazdek
const StarRatingDisplay = ({ rating, count }) => {
    if (count === 0) return <small>Brak opinii</small>;
    const totalStars = 5;
    let stars = [];
    for (let i = 1; i <= totalStars; i++) {
        stars.push(<span key={i} style={{ color: i <= rating ? 'gold' : 'grey' }}>★</span>);
    }
    return <div>{stars} <small>({count})</small></div>;
};


const InstallerCard = ({ profile }) => {
  // Poprawka: używamy 'specializations' a nie 'specialization'
  const specializationsText = profile.specializations?.join(', ') || 'Nie podano';
  const imageUrl = profile.profile_image_url || 'https://placehold.co/300x200/eee/ccc?text=Brak+zdjęcia';

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', margin: '10px' }}>
      <img 
        src={imageUrl} 
        alt={profile.service_name} 
        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }} 
      />
      <h3>{profile.service_name}</h3>
      
      {/* Nowa sekcja z ocenami */}
      <div style={{ margin: '8px 0' }}>
        <StarRatingDisplay rating={profile.average_rating} count={profile.review_count} />
      </div>

      <p><strong>Specjalizacje:</strong> {specializationsText}</p>
      
      <Link to={`/profile/${profile.profile_id}`}>
        Zobacz szczegóły
      </Link>
    </div>
  );
};

export default InstallerCard;