import React from 'react';
import { Link } from 'react-router-dom';
// ZMIANA: Importujemy również DIRECT_BACKEND_URL
import { DIRECT_BACKEND_URL } from './apiConfig.js'; 

const InstallerCard = ({ profile }) => {
  const specializationsText = profile.specializations?.join(', ') || 'Brak danych';

  // ZMIANA: Tworzymy pełny, bezpośredni adres URL do obrazka
  const imageUrl = profile.profile_image_url 
    ? `${DIRECT_BACKEND_URL}${profile.profile_image_url}` 
    : 'https://placehold.co/300x200/eee/ccc?text=Brak+zdjęcia';

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', margin: '10px' }}>
      <img 
        src={imageUrl} 
        alt={profile.service_name} 
        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }} 
      />
      <h3>{profile.service_name}</h3>
      <p><strong>Specjalizacje:</strong> {specializationsText}</p>
      <Link to={`/profile/${profile.profile_id}`}>
        Zobacz szczegóły
      </Link>
    </div>
  );
};

export default InstallerCard;