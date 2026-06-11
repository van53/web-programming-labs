import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/">Auth App</Link>
      </div>
      <nav className="header-nav">
        {user ? (
          <>
            <span className="header-email">{user.email}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Вийти
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">
              Увійти
            </Link>
            <Link to="/register" className="btn btn-primary">
              Зареєструватися
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
