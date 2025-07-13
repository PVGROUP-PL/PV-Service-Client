// src/InstallerCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const StarRatingDisplay = ({ rating, count }) => {
    if (count === 0) return <small style={{ color: '#6c757d' }}>Brak opinii</small>;
    const totalStars = 5;
    let stars = [];
    for (let i = 1; i <= totalStars; i++) {
        stars.push(<span key={i} style={{ color: i <= rating ? '#ffc107' : '#e0e0e0', fontSize: '1.2rem' }}>★</span>);
    }
    return <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>{stars} <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>({count})</span></div>;
};

const styles = {
    card: {
        backgroundColor: 'var(--white)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    },
    cardImage: {
        width: '100%',
        height: '180px',
        objectFit: 'cover',
        display: 'block',
    },
    cardBody: {
        padding: '16px',
    },
    cardTitle: {
        margin: '0 0 8px 0',
    },
    cardText: {
        margin: '4px 0',
        color: 'var(--light-text)',
        fontSize: '0.9rem',
    },
    cardLink: {
        display: 'inline-block',
        marginTop: '12px',
        fontWeight: 'bold',
    }
};

const InstallerCard = ({ profile }) => {
  const specializationsText = profile.service_types?.join(', ') || 'Nie podano';
  const imageUrl = profile.profile_image_url || `https://placehold.co/400x250/005A9C/FFFFFF?text=${encodeURIComponent(profile.service_name)}`;

  return (
    <div style={styles.card} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
      <img 
        src={imageUrl} 
        alt={profile.service_name} 
        style={styles.cardImage} 
      />
      <div style={styles.cardBody}>
        <h3 style={styles.cardTitle}>{profile.service_name}</h3>
        <StarRatingDisplay rating={profile.average_rating} count={profile.review_count} />
        <p style={styles.cardText}>
            <strong>Główne usługi:</strong> {specializationsText}
        </p>
        <Link to={`/profile/${profile.profile_id}`} style={styles.cardLink}>
          Zobacz szczegóły &rarr;
        </Link>
      </div>
    </div>
  );
};

export default InstallerCard;