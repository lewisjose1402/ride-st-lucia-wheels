
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCompanyAccess } from '@/hooks/useCompanyAccess';
import LoadingSpinner from '@/components/common/LoadingSpinner';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'rental_company';
};

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin, isRentalCompany } = useAuth();
  const { hasCompanyProfile, isLoading: companyLoading } = useCompanyAccess();

  console.log("ProtectedRoute - user:", !!user, "isLoading:", isLoading, "isAdmin:", isAdmin, "isRentalCompany:", isRentalCompany, "requiredRole:", requiredRole, "hasCompanyProfile:", hasCompanyProfile);

  // Show loading while authentication state is being determined
  if (isLoading || companyLoading) {
    console.log("Still loading, showing loading state");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Verifying access permissions..." />
      </div>
    );
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

  if (requiredRole === 'rental_company') {
    // Allow access if user is a rental company OR if they're an admin with a company profile
    const canAccessCompanyRoutes = isRentalCompany || (isAdmin && hasCompanyProfile);
    if (!canAccessCompanyRoutes) {
      console.log("Rental company access required but user doesn't qualify, redirecting to home");
      return <Navigate to="/" replace />;
    }
  }

  console.log("Access granted, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
