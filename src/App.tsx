import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import {
  Splash,
  Login,
  Signup,
  Onboarding,
  hasCompletedOnboarding,
  isLoggedIn,
  Home,
  Survival,
  SurvivalDetail,
  Report,
  MyReports,
  Profile,
  EmergencyCall,
  HazardPack,
  AuthCallback,
  About,
  SecuritySettings,
  VerifyEmail,
  ForgotPassword,
  ResetPassword,
  Settings
} from './pages';

function getInitialRoute() {
  if (!isLoggedIn()) {
    return '/login';
  }
  if (!hasCompletedOnboarding()) {
    return '/onboarding';
  }
  return '/home';
}

import { VerificationBanner } from './components/layout/VerificationBanner';
import { VERIFICATION_REQUIRED_EVENT } from './api/client';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function GlobalAuthHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleVerificationRequired = () => {
      // Avoid redirect loops if already on the verify page
      if (location.pathname !== '/settings/verify-email') {
        navigate('/settings/verify-email', { replace: true });
      }
    };

    window.addEventListener(VERIFICATION_REQUIRED_EVENT, handleVerificationRequired);
    return () => {
      window.removeEventListener(VERIFICATION_REQUIRED_EVENT, handleVerificationRequired);
    };
  }, [navigate, location.pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <GlobalAuthHandler />
        <VerificationBanner />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/survival" element={<Survival />} />
          <Route path="/survival/:hazardId" element={<SurvivalDetail />} />
          <Route path="/report" element={<Report />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/emergency" element={<EmergencyCall />} />
          <Route path="/hazard-pack" element={<HazardPack />} />
          <Route path="/about" element={<About />} />
          <Route path="/security" element={<SecuritySettings />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/settings/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to={getInitialRoute()} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
