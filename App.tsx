import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import ClientDashboard from './pages/ClientDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import BookingPage from './pages/BookingPage';
import ServicesManagementPage from './pages/ServicesManagementPage';
import SettingsPage from './pages/SettingsPage';
import PricingPage from './pages/PricingPage';
import Layout from './components/Layout';
import { UserRole } from './types';
import { NotificationProvider } from './hooks/useNotifications';
import AnalyticsPage from './pages/AnalyticsPage';
import RegistrationPage from './pages/RegistrationPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <HashRouter>
          <Main />
        </HashRouter>
      </NotificationProvider>
    </AuthProvider>
  );
};

const Main: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <RegistrationPage /> : <Navigate to="/" />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route
        path="/*"
        element={
          user ? (
            <Layout>
              <Routes>
                <Route path="/" element={user.role === UserRole.CLIENT ? <Navigate to="/client/dashboard" /> : <Navigate to="/provider/dashboard" />} />
                
                {/* Client Routes */}
                <Route path="/client/dashboard" element={<ProtectedRoute role={UserRole.CLIENT}><ClientDashboard /></ProtectedRoute>} />
                <Route path="/client/book" element={<ProtectedRoute role={UserRole.CLIENT}><BookingPage /></ProtectedRoute>} />
                <Route path="/client/settings" element={<ProtectedRoute role={UserRole.CLIENT}><SettingsPage /></ProtectedRoute>} />
                
                {/* Provider Routes */}
                <Route path="/provider/dashboard" element={<ProtectedRoute role={UserRole.PROVIDER}><ProviderDashboard /></ProtectedRoute>} />
                <Route path="/provider/analytics" element={<ProtectedRoute role={UserRole.PROVIDER}><AnalyticsPage /></ProtectedRoute>} />
                <Route path="/provider/services" element={<ProtectedRoute role={UserRole.PROVIDER}><ServicesManagementPage /></ProtectedRoute>} />
                <Route path="/provider/settings" element={<ProtectedRoute role={UserRole.PROVIDER}><SettingsPage /></ProtectedRoute>} />
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

interface ProtectedRouteProps {
  role: UserRole;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, children }) => {
  const { user } = useAuth();
  if (!user || user.role !== role) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

export default App;