
import { Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VehicleSpecificationsProps {
  vehicle: any;
  vehicleType: string;
}

const VehicleSpecifications = ({ vehicle, vehicleType }: VehicleSpecificationsProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Vehicle Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded">
            <Car size={20} className="mx-auto text-brand-purple mb-1" />
            <p className="text-xs text-gray-500">Type</p>
            <p className="font-medium">{vehicleType}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <span className="block text-xl text-brand-purple mb-1">A</span>
            <p className="text-xs text-gray-500">Transmission</p>
            <p className="font-medium">{vehicle.transmission || 'Manual'}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <span className="block text-xl text-brand-purple mb-1">👤</span>
            <p className="text-xs text-gray-500">Seats</p>
            <p className="font-medium">{vehicle.seats}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <span className="block text-xl text-brand-purple mb-1">💰</span>
            <p className="text-xs text-gray-500">Price per day</p>
            <p className="font-medium">${vehicle.price_per_day}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleSpecifications;
