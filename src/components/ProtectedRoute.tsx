
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'rental_company';
};

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin, isRentalCompany } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'rental_company' && !isRentalCompany) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
