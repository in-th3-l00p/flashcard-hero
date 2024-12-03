import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  fallback: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children, fallback }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-400 border-t-transparent"></div>
      </div>
    );
  }

  return currentUser ? <Navigate to={fallback} /> : <>{children}</>;
};