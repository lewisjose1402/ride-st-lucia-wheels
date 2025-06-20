
import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import VehicleHeader from './VehicleHeader';
import VehicleImageGallery from './VehicleImageGallery';
import VehicleInfoTabs from './VehicleInfoTabs';
import BookingCard from './BookingCard';
import CompanyInfoCard from './CompanyInfoCard';
import BookingRequirementsDisplay from './BookingRequirementsDisplay';
import VehicleBreadcrumbs from './VehicleBreadcrumbs';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useBookingRequirements } from '@/hooks/useBookingRequirements';
import { Vehicle } from '@/types/vehicle';

interface VehicleDetailContentProps {
  vehicle: Vehicle;
  companyData: any;
}

const VehicleDetailContent = ({ vehicle, companyData }: VehicleDetailContentProps) => {
  const { user } = useAuth();
  
  // Fetch booking requirements for this vehicle's company
  const { requirements, isLoading: requirementsLoading, error: requirementsError } = useBookingRequirements(companyData?.id);
  
  console.log('VehicleDetailContent: Company ID for requirements:', companyData?.id);
  console.log('VehicleDetailContent: Requirements loaded:', requirements);
  console.log('VehicleDetailContent: Requirements loading:', requirementsLoading);
  console.log('VehicleDetailContent: Requirements error:', requirementsError);

  // Derive vehicle type from the vehicle data
  const vehicleType = vehicle.vehicle_types?.name || 'Vehicle';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <VehicleBreadcrumbs vehicleName={vehicle.name} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Vehicle details */}
        <div className="lg:col-span-2">
          <VehicleHeader vehicle={vehicle} vehicleType={vehicleType} />
          <VehicleImageGallery vehicle={vehicle} />
          <VehicleInfoTabs vehicle={vehicle} vehicleType={vehicleType} />
        </div>
        
        {/* Right column - Booking and company info */}
        <div className="space-y-6">
          {/* Booking requirements - show for all users when company data exists */}
          {companyData ? (
            <BookingRequirementsDisplay 
              requirements={requirements}
              isLoading={requirementsLoading}
              error={requirementsError}
            />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-center text-gray-600">
                Company information not available
              </p>
            </div>
          )}
          
          {user ? (
            <BookingCard vehicle={vehicle} />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-center text-gray-600 mb-4">
                Please sign in to book this vehicle
              </p>
              <Link 
                to="/signin" 
                className="block w-full bg-brand-purple hover:bg-brand-purple-dark text-white text-center py-2 px-4 rounded"
              >
                Sign In to Book
              </Link>
            </div>
          )}
          
          {companyData && <CompanyInfoCard companyData={companyData} />}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailContent;
