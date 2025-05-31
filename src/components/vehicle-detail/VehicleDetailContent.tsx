
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import VehicleHeader from './VehicleHeader';
import VehicleImageGallery from './VehicleImageGallery';
import VehicleInfoTabs from './VehicleInfoTabs';
import BookingCard from './BookingCard';
import CompanyInfoCard from './CompanyInfoCard';
import BookingRequirementsDisplay from './BookingRequirementsDisplay';
import { useBookingRequirements } from '@/hooks/useBookingRequirements';
import { Vehicle } from '@/types/vehicle';

interface VehicleDetailContentProps {
  vehicle: Vehicle;
  companyData: any;
}

const VehicleDetailContent = ({ vehicle, companyData }: VehicleDetailContentProps) => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState('');
  
  // Fetch booking requirements for this vehicle's company
  const { requirements, isLoading: requirementsLoading } = useBookingRequirements(companyData?.id);
  
  console.log('VehicleDetailContent: Company ID for requirements:', companyData?.id);
  console.log('VehicleDetailContent: Requirements loaded:', requirements);
  console.log('VehicleDetailContent: Requirements loading:', requirementsLoading);

  // Derive vehicle type from the vehicle data
  const vehicleType = vehicle.vehicle_types?.name || 'Vehicle';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-4">
        <a href="/" className="hover:text-brand-purple">Home</a>
        <span className="mx-2">/</span>
        <a href="/vehicles" className="hover:text-brand-purple">Vehicles</a>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{vehicle.name}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Vehicle details */}
        <div className="lg:col-span-2">
          <VehicleHeader vehicle={vehicle} vehicleType={vehicleType} />
          <VehicleImageGallery vehicle={vehicle} />
          <VehicleInfoTabs vehicle={vehicle} vehicleType={vehicleType} />
        </div>
        
        {/* Right column - Booking and company info */}
        <div className="space-y-6">
          {/* Always show booking requirements if we have company data */}
          {companyData?.id && (
            <BookingRequirementsDisplay 
              requirements={requirements}
              isLoading={requirementsLoading}
            />
          )}
          
          {user ? (
            <BookingCard vehicle={vehicle} />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-center text-gray-600 mb-4">
                Please sign in to book this vehicle
              </p>
              <a 
                href="/signin" 
                className="block w-full bg-brand-purple hover:bg-brand-purple-dark text-white text-center py-2 px-4 rounded"
              >
                Sign In to Book
              </a>
            </div>
          )}
          
          <CompanyInfoCard companyData={companyData} />
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailContent;
