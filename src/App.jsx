import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext.jsx';

// Import stron i komponentów
import HomePage from './HomePage.jsx';
import LoginPage from './LoginPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import DashboardPage from './DashboardPage.jsx';
import ChatPage from './ChatPage.jsx';
import Navbar from './Navbar.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

// NOWOŚĆ: Zaktualizowane importy dla nowych komponentów
import CreateProfilePage from './CreateProfilePage.jsx'; // Dawniej AddTruckPage
import ProfileDetailsPage from './ProfileDetailsPage.jsx'; // Dawniej TruckDetailsPage

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            {/* Trasy publiczne */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* NOWOŚĆ: Zaktualizowana trasa dla szczegółów profilu */}
            <Route path="/profile/:profileId" element={<ProfileDetailsPage />} />

            {/* Trasy chronione (dla zalogowanych użytkowników) */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/chat/:conversationId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

            {/* NOWOŚĆ: Zaktualizowana trasa dla tworzenia profilu (tylko dla instalatorów) */}
            <Route path="/create-profile" element={<ProtectedRoute><CreateProfilePage /></ProtectedRoute>} />
            
            {/* Dodać można również trasę do edycji profilu, np. /edit-profile */}

          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;