
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoadingState from '@/components/company/dashboard/LoadingState';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'rental_company';
};

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin, isRentalCompany } = useAuth();

  if (isLoading) {
    return <LoadingState />;
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
