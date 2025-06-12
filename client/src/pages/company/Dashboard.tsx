
import React from 'react';
import CompanyLayout from '@/components/company/CompanyLayout';
import DashboardWelcome from '@/components/company/dashboard/DashboardWelcome';
import StatsCards from '@/components/company/dashboard/StatsCards';
import QuickActions from '@/components/company/dashboard/QuickActions';
import RecentVehicles from '@/components/company/dashboard/RecentVehicles';
import LoadingState from '@/components/company/dashboard/LoadingState';
import MissingProfileState from '@/components/company/dashboard/MissingProfileState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useCompanyDashboard } from '@/hooks/useCompanyDashboard';
import { AlertTriangle } from 'lucide-react';

const CompanyDashboard = () => {
  const { isLoading, companyData, vehicles, bookingStats, error } = useCompanyDashboard();

  if (isLoading) {
    return (
      <CompanyLayout title="Dashboard">
        <LoadingState />
      </CompanyLayout>
    );
  }

  if (error) {
    return (
      <CompanyLayout title="Dashboard">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 text-center max-w-md">{error}</p>
        </div>
      </CompanyLayout>
    );
  }
  
  // If still no companyData after loading, show missing profile message
  if (!companyData) {
    return (
      <CompanyLayout title="Dashboard">
        <MissingProfileState />
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout title="Dashboard">
      <DashboardWelcome companyName={companyData?.company_name} />
      <StatsCards 
        vehicleCount={vehicles.length} 
        activeBookings={bookingStats.activeBookings} 
        totalRevenue={bookingStats.totalRevenue}
      />
      <QuickActions />
      <RecentVehicles vehicles={vehicles} />
    </CompanyLayout>
  );
};

export default CompanyDashboard;
