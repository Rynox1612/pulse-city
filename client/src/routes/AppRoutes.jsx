import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config/appConstants';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route Guards
import ProtectedRoute, { AdminRoute } from './ProtectedRoute';

import HomePage from '../pages/public/HomePage';
import HospitalsPage from '../pages/public/HospitalsPage';
import HospitalDetailPage from '../pages/public/HospitalDetailPage';
import DoctorsPage from '../pages/public/DoctorsPage';
import { AboutPage, EmergencyMapPage, AIAssistantPage, ContactPage } from '../pages/public/PublicPages';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import { AdminLoginPage } from '../pages/auth/AuthPages';

// User Dashboard Pages
import ProfilePage from '../pages/user/ProfilePage';
import MedicalInfoPage from '../pages/user/MedicalInfoPage';
import SavedHospitalsPage from '../pages/user/SavedHospitalsPage';
import EmergencyRequestsPage from '../pages/user/EmergencyRequestsPage';
import CreateEmergencyRequestPage from '../pages/user/CreateEmergencyRequestPage';

// Admin Pages
import { AdminDashboardPage, ManageDoctorsPage, UpdateAvailabilityPage, IncomingRequestsPage, HospitalProfilePage } from '../pages/admin/AdminPages';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public Pages (MainLayout: Navbar + Footer) ─────────────────── */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.HOSPITALS} element={<HospitalsPage />} />
        <Route path="/hospitals/:id" element={<HospitalDetailPage />} />
        <Route path={ROUTES.DOCTORS} element={<DoctorsPage />} />
        <Route path={ROUTES.EMERGENCY_MAP} element={<EmergencyMapPage />} />
        <Route path={ROUTES.AI_ASSISTANT} element={<AIAssistantPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
      </Route>

      {/* ── Protected User Pages (DashboardLayout + ProtectedRoute) ───── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.MEDICAL_INFO} element={<MedicalInfoPage />} />
          <Route path={ROUTES.SAVED_HOSPITALS} element={<SavedHospitalsPage />} />
          <Route path={ROUTES.EMERGENCY_REQUESTS} element={<EmergencyRequestsPage />} />
          <Route path={ROUTES.CREATE_REQUEST} element={<CreateEmergencyRequestPage />} />
        </Route>
      </Route>

      {/* ── Admin-Only Pages (AdminLayout + AdminRoute) ──────────────── */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
          <Route path={ROUTES.HOSPITAL_PROFILE} element={<HospitalProfilePage />} />
          <Route path={ROUTES.MANAGE_DOCTORS} element={<ManageDoctorsPage />} />
          <Route path={ROUTES.UPDATE_AVAILABILITY} element={<UpdateAvailabilityPage />} />
          <Route path={ROUTES.INCOMING_REQUESTS} element={<IncomingRequestsPage />} />
        </Route>
      </Route>

      {/* ── 404 Fallback ──────────────────────────────────────────────── */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
          <h1 className="text-5xl font-bold text-neutral-300">404</h1>
          <p className="text-neutral-500 text-lg">Page not found.</p>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;
