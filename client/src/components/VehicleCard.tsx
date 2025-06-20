
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { getAddressFromLocationData } from '@/utils/locationHelpers';

interface VehicleCardProps {
  id: number;
  name: string;
  image: string;
  type: string;
  seats: number;
  transmission: string;
  price: number;
  rating: number;
  location: any;
  featured?: boolean;
}

const VehicleCard = ({ 
  id, 
  name, 
  image, 
  type, 
  seats, 
  transmission, 
  price, 
  rating, 
  location,
  featured = false
}: VehicleCardProps) => {
  // Format location for display
  const formatLocationDisplay = (loc: any): string => {
    if (typeof loc === 'string') return loc;
    
    const { street_address, constituency } = getAddressFromLocationData(loc);
    const parts = [];
    if (street_address) parts.push(street_address);
    if (constituency) parts.push(constituency);
    
    return parts.join(', ') || "N/A";
  };

  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${featured ? 'border-2 border-brand-orange' : ''}`}>
      {featured && (
        <Badge className="absolute z-10 top-2 right-2 bg-brand-orange">Featured</Badge>
      )}
      
      {/* Vehicle image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-brand-dark">{name}</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{formatLocationDisplay(location)}</p>
        
        {/* Vehicle details */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700">
            {type}
          </Badge>
          <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700">
            {seats} Seats
          </Badge>
          <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700">
            {transmission}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
          <div>
            <span className="font-bold text-lg text-brand-dark">${price}</span>
            <span className="text-gray-600 text-sm"> / day</span>
          </div>
          <Link to={`/vehicles/${id}`}>
            <Button className="bg-brand-purple hover:bg-brand-purple-dark text-white">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
