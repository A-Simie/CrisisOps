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

import { VERIFICATION_REQUIRED_EVENT } from './api/client';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Splash />;

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <Splash />;

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

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
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Protected Routes */}
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/survival" 
            element={
              <ProtectedRoute>
                <Survival />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/survival/:hazardId" 
            element={
              <ProtectedRoute>
                <SurvivalDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/report" 
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-reports" 
            element={
              <ProtectedRoute>
                <MyReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/emergency" 
            element={
              <ProtectedRoute>
                <EmergencyCall />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hazard-pack" 
            element={
              <ProtectedRoute>
                <HazardPack />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/about" 
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/security" 
            element={
              <ProtectedRoute>
                <SecuritySettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to={getInitialRoute()} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
