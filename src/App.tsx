import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
  HazardPack
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/survival" element={<Survival />} />
        <Route path="/survival/:hazardId" element={<SurvivalDetail />} />
        <Route path="/report" element={<Report />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/emergency" element={<EmergencyCall />} />
        <Route path="/hazard-pack" element={<HazardPack />} />
        <Route path="*" element={<Navigate to={getInitialRoute()} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
