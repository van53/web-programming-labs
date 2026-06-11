import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <main>
            <Routes>
              {/* Публічні маршрути — лише для неаутентифікованих */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Захищені маршрути — лише для аутентифікованих */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Перенаправлення з кореня */}
              <Route path="/" element={<Navigate to="/profile" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
