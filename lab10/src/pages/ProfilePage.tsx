import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { User } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useQuery<User>({
    queryKey: ['me'],
    queryFn: () => api.get<User>('/auth/me').then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="page-center">
        <div className="loading">Завантаження профілю...</div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="page-center">
        <div className="alert alert-error">Не вдалося завантажити профіль</div>
      </div>
    );
  }

  return (
    <div className="page-center">
      <div className="card">
        <h1 className="card-title">Профіль користувача</h1>
        <div className="profile-info">
          <div className="profile-row">
            <span className="profile-label">ID</span>
            <span className="profile-value">{user.id}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Email</span>
            <span className="profile-value">{user.email}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Дата реєстрації</span>
            <span className="profile-value">
              {new Date(user.createdAt).toLocaleString('uk-UA')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
