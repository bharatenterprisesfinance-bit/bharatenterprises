import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PlansPage } from './pages/PlansPage';
import { ContactPage } from './pages/ContactPage';
import { ApplicationPage } from './pages/ApplicationPage';
import { SplashScreen } from './components/SplashScreen';
import { LanguageProvider } from './context/LanguageContext';

function AppContent() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <>
      <ScrollToTop />
      {showWelcome && <SplashScreen onComplete={() => setShowWelcome(false)} />}
      
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<Navigate to="/plans" replace />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/apply" element={<ApplicationPage />} />
          <Route path="/calculator" element={<Navigate to="/plans" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
