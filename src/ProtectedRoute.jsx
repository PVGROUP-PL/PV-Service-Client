import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Sprawdzamy, czy w localStorage istnieje zapisany token
  const token = localStorage.getItem('token');

  // Jeśli token istnieje, renderujemy "Outlet", czyli chronioną podstronę (np. Dashboard).
  // Jeśli tokena nie ma, przekierowujemy użytkownika na stronę główną (logowanie).
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;