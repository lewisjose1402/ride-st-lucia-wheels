import { Car, Check } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

interface VehicleInfoTabsProps {
  vehicle: any;
  vehicleType: string;
}

const VehicleInfoTabs = ({ vehicle, vehicleType }: VehicleInfoTabsProps) => {
  const getFeaturesList = () => {
    if (!vehicle.features || typeof vehicle.features !== 'object') return [];
    
    const featureMap = {
      air_conditioning: 'Air Conditioning',
      bluetooth: 'Bluetooth',
      gps: 'GPS Navigation',
      usb: 'USB Ports',
      child_seat: 'Child Seat Available',
      backup_camera: 'Backup Camera',
      roof_rack: 'Roof Rack',
      gps_navigation: 'GPS Navigation',
      usb_port: 'USB Port'
    };

    return Object.entries(vehicle.features)
      .filter(([key, value]) => value === true)
      .map(([key]) => featureMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
  };

  const features = getFeaturesList();

  return (
    <div>
      {/* Description Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-brand-dark mb-2">Vehicle Description</h2>
        <p className="text-gray-600">Learn more about this vehicle's features and specifications</p>
      </div>

      <Tabs defaultValue="description" className="mb-8">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>About this vehicle</CardTitle>
              <CardDescription>
                {vehicle.name} • Available for rent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                  <span className="block text-xl text-brand-purple mb-1">⛽</span>
                  <p className="text-xs text-gray-500">Fuel</p>
                  <p className="font-medium">Gasoline</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <span className="block text-xl text-brand-purple mb-1">👤</span>
                  <p className="text-xs text-gray-500">Seats</p>
                  <p className="font-medium">{vehicle.seats}</p>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {vehicle.description || `Experience the beauty of St. Lucia with our ${vehicle.name}. This reliable vehicle offers comfort and convenience for your island adventure.`}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Features</CardTitle>
            </CardHeader>
            <CardContent>
              {features.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check size={16} className="text-brand-purple mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No specific features listed for this vehicle.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>
                No reviews yet for this vehicle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Be the first to review this vehicle!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleInfoTabs;
