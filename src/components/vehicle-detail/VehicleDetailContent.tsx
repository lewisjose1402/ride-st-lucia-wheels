
import VehicleHeader from './VehicleHeader';
import VehicleImageGallery from './VehicleImageGallery';
import VehicleInfoTabs from './VehicleInfoTabs';
import BookingCard from './BookingCard';
import CompanyInfoCard from './CompanyInfoCard';

interface VehicleDetailContentProps {
  vehicle: any;
  companyData: any;
}

const VehicleDetailContent = ({ vehicle, companyData }: VehicleDetailContentProps) => {
  // Get vehicle type from name or create a default based on vehicle characteristics
  const getVehicleType = () => {
    if (!vehicle.name) return 'Vehicle';
    
    const name = vehicle.name.toLowerCase();
    
    // Try to determine type from the vehicle name
    if (name.includes('suv') || name.includes('rav4') || name.includes('cr-v')) return 'SUV';
    if (name.includes('jeep') || name.includes('wrangler')) return 'Jeep';
    if (name.includes('van') || name.includes('minivan')) return 'Van';
    if (name.includes('convertible') || name.includes('cabrio')) return 'Convertible';
    if (name.includes('hatchback')) return 'Hatchback';
    if (name.includes('sedan') || name.includes('camry') || name.includes('accord')) return 'Sedan';
    
    // Default fallback based on seats
    if (vehicle.seats >= 7) return 'Van';
    if (vehicle.seats >= 5) return 'SUV';
    return 'Sedan';
  };

  const vehicleType = getVehicleType();

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
        <div>
          <BookingCard vehicle={vehicle} />
          <CompanyInfoCard companyData={companyData} vehicle={vehicle} />
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailContent;
