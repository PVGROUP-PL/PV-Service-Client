import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config';

function AddTruckForm() {
  const [truckName, setTruckName] = useState('');
  const [description, setDescription] = useState('');
  const [cuisineTypes, setCuisineTypes] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [radius, setRadius] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setMainImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('Dodawanie food trucka...');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Brak autoryzacji.');
      return;
    }

    const formData = new FormData();
    formData.append('truck_name', truckName);
    formData.append('description', description);
    formData.append('cuisine_types', cuisineTypes);
    formData.append('base_postal_code', postalCode);
    formData.append('service_radius_km', radius);
    if (mainImage) {
      formData.append('main_image', mainImage);
    }

    try {
      const response = await fetch(`${API_URL}/api/trucks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert('Food truck dodany pomyślnie!');
        navigate('/dashboard');
      } else {
        setMessage(`Błąd: ${data.message}`);
      }
    } catch (error) {
      setMessage('Błąd sieci.');
      console.error('Błąd podczas dodawania food trucka:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div><label>Nazwa food trucka:</label><input type="text" value={truckName} onChange={(e) => setTruckName(e.target.value)} required /></div>
      <div><label>Opis:</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
      <div><label>Typy kuchni (po przecinku):</label><input type="text" value={cuisineTypes} onChange={(e) => setCuisineTypes(e.target.value)} /></div>
      <div><label>Kod pocztowy bazy:</label><input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required /></div>
      <div><label>Zasięg (km):</label><input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} required /></div>
      <div><label>Zdjęcie główne:</label><input type="file" onChange={handleFileChange} /></div>
      <button type="submit">Dodaj Food Trucka</button>
      {message && <p>{message}</p>}
    </form>
  );
}
export default AddTruckForm;