
import React from 'react';
import CompanyLayout from '@/components/company/CompanyLayout';
import DashboardWelcome from '@/components/company/dashboard/DashboardWelcome';
import StatsCards from '@/components/company/dashboard/StatsCards';
import QuickActions from '@/components/company/dashboard/QuickActions';
import RecentVehicles from '@/components/company/dashboard/RecentVehicles';
import LoadingState from '@/components/company/dashboard/LoadingState';
import MissingProfileState from '@/components/company/dashboard/MissingProfileState';
import { useCompanyDashboard } from '@/hooks/useCompanyDashboard';

const CompanyDashboard = () => {
  const { isLoading, companyData, vehicles } = useCompanyDashboard();

  if (isLoading) {
    return (
      <CompanyLayout title="Dashboard">
        <LoadingState />
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
      <StatsCards vehicleCount={vehicles.length} />
      <QuickActions />
      <RecentVehicles vehicles={vehicles} />
    </CompanyLayout>
  );
};

export default CompanyDashboard;
