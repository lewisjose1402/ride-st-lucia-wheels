
import { MapPin, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getAddressFromLocationData } from '@/utils/locationHelpers';

interface VehicleHeaderProps {
  vehicle: any;
  vehicleType: string;
}

const VehicleHeader = ({ vehicle, vehicleType }: VehicleHeaderProps) => {
  const formatLocationDisplay = (loc: any): string => {
    if (typeof loc === 'string') return loc;
    
    const { street_address, constituency } = getAddressFromLocationData(loc);
    const parts = [];
    if (street_address) parts.push(street_address);
    if (constituency) parts.push(constituency);
    
    return parts.join(', ') || "St. Lucia";
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-dark">{vehicle.name}</h1>
        <Badge className="bg-brand-purple">{vehicleType}</Badge>
      </div>
      <div className="flex items-center mt-2">
        <MapPin size={16} className="text-gray-500 mr-1" />
        <span className="text-gray-600">{formatLocationDisplay(vehicle.location)}</span>
        
        <div className="flex items-center ml-4">
          <Star size={16} className="text-brand-orange fill-brand-orange mr-1" />
          <span className="font-medium">{vehicle.rating || 4.5}</span>
          <span className="text-gray-500 ml-1">(0 reviews)</span>
        </div>
      </div>
    </div>
  );
};

export default VehicleHeader;
