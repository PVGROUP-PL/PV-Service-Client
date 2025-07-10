// InstallerCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://bookthefoodtruck-api.onrender.com' 
  : 'http://localhost:3000';

const InstallerCard = ({ profile }) => {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', margin: '10px' }}>
      <img 
        src={profile.logo_url ? `${API_URL}${profile.logo_url}` : 'https://placehold.co/300x200/eee/ccc?text=Brak+Logo'} 
        alt={profile.service_name} 
        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }} 
      />
      <h3>{profile.service_name}</h3>
      <p><strong>Specjalizacje:</strong> {profile.specializations}</p>
      <Link to={`/profile/${profile.profile_id}`}>
        Zobacz szczegóły
      </Link>
    </div>
  );
};

export default InstallerCard;