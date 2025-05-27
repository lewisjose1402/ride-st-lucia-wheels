
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoadingState from '@/components/company/dashboard/LoadingState';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'rental_company';
};

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin, isRentalCompany } = useAuth();

  console.log("ProtectedRoute - user:", !!user, "isLoading:", isLoading, "isAdmin:", isAdmin, "isRentalCompany:", isRentalCompany, "requiredRole:", requiredRole);

  // Show loading while authentication state is being determined
  if (isLoading) {
    console.log("Still loading, showing loading state");
    return <LoadingState />;
  }

  // Redirect to signin if no user is authenticated
  if (!user) {
    console.log("No user found, redirecting to signin");
    return <Navigate to="/signin" replace />;
  }

  // Check role-specific access
  if (requiredRole === 'admin' && !isAdmin) {
    console.log("Admin required but user is not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'rental_company' && !isRentalCompany) {
    console.log("Rental company required but user is not rental company, redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("Access granted, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
