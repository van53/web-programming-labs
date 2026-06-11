import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Пропускає лише неаутентифікованих користувачів.
 * Аутентифікованих перенаправляє на /profile.
 */
export default function PublicRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="loading">Завантаження...</div>;
  if (user) return <Navigate to="/profile" replace />;

  return <Outlet />;
}
