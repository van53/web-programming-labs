import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Пропускає лише аутентифікованих користувачів.
 * Під час першого завантаження (перевірка токена) нічого не рендерить.
 */
export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="loading">Завантаження...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
