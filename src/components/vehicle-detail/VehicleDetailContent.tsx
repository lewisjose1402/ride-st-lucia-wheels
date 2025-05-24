
import { useState, useEffect } from 'react';
import { MapPin, Star, Car, Check, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAddressFromLocationData } from '@/utils/locationHelpers';
import CompanyInfoCard from './CompanyInfoCard';
import { Vehicle, RentalCompany } from '@/types/vehicle';

interface VehicleDetailContentProps {
  vehicle: Vehicle;
  companyData: RentalCompany | null;
}

const VehicleDetailContent = ({ vehicle, companyData }: VehicleDetailContentProps) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');

  console.log('VehicleDetailContent received:', {
    vehicle: vehicle?.id,
    vehicleName: vehicle?.name,
    companyData: companyData?.id,
    companyName: companyData?.company_name,
    hasVehicleImages: vehicle?.vehicle_images?.length || 0
  });

  const images = vehicle.vehicle_images || [];

  // Set primary image on component mount
  useEffect(() => {
    if (images.length > 0) {
      const primaryImage = images.find((img: any) => img.is_primary);
      setSelectedImage(primaryImage?.image_url || images[0]?.image_url || '/placeholder.svg');
    }
  }, [images]);

  // Get vehicle type from the joined vehicle_types table or fallback to name analysis
  const getVehicleType = () => {
    if (vehicle.vehicle_types?.name) {
      return vehicle.vehicle_types.name;
    }
    
    if (!vehicle.name) return 'Vehicle';
    
    const name = vehicle.name.toLowerCase();
    if (name.includes('suv') || name.includes('rav4') || name.includes('cr-v')) return 'SUV';
    if (name.includes('jeep') || name.includes('wrangler')) return 'Jeep';
    if (name.includes('van') || name.includes('minivan')) return 'Van';
    if (name.includes('convertible') || name.includes('cabrio')) return 'Convertible';
    if (name.includes('hatchback')) return 'Hatchback';
    if (name.includes('sedan') || name.includes('camry') || name.includes('accord')) return 'Sedan';
    
    if (vehicle.seats >= 7) return 'Van';
    if (vehicle.seats >= 5) return 'SUV';
    return 'Sedan';
  };

  const formatLocationDisplay = (loc: any): string => {
    if (typeof loc === 'string') return loc;
    
    const { street_address, constituency } = getAddressFromLocationData(loc);
    const parts = [];
    if (street_address) parts.push(street_address);
    if (constituency) parts.push(constituency);
    
    return parts.join(', ') || "St. Lucia";
  };

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

  const vehicleType = getVehicleType();
  const features = getFeaturesList();

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
          {/* Vehicle Header */}
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

          {/* Vehicle Images */}
          <div className="mb-8">
            {selectedImage && (
              <div className="w-full h-[300px] md:h-[400px] bg-white rounded-lg overflow-hidden mb-2">
                <img 
                  src={selectedImage} 
                  alt={vehicle.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image: any, index: number) => (
                  <div 
                    key={image.id} 
                    className={`h-16 md:h-24 bg-white rounded overflow-hidden cursor-pointer
                      ${selectedImage === image.image_url ? 'ring-2 ring-brand-purple' : ''}`}
                    onClick={() => setSelectedImage(image.image_url)}
                  >
                    <img 
                      src={image.image_url} 
                      alt={`${vehicle.name} view ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Specifications */}
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

          {/* Vehicle Info Tabs */}
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
                </CardHeader>
                <CardContent>
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
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">No reviews yet for this vehicle. Be the first to review!</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right column - Booking and company info */}
        <div>
          {/* Booking Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                <span className="text-2xl font-bold">${vehicle.price_per_day}</span>
                <span className="text-gray-500 text-base font-normal"> / day</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pickupDate">Pickup Date</Label>
                  <div className="relative mt-1">
                    <Input
                      id="pickupDate"
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="dropoffDate">Dropoff Date</Label>
                  <div className="relative mt-1">
                    <Input
                      id="dropoffDate"
                      type="date"
                      value={dropoffDate}
                      onChange={(e) => setDropoffDate(e.target.value)}
                      className="w-full"
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <Button 
                  className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white"
                  disabled={!pickupDate || !dropoffDate}
                >
                  Book Now
                </Button>
                
                <div className="text-center text-sm text-gray-500 mt-2">
                  Only 10% deposit required to confirm
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information Card */}
          <CompanyInfoCard vehicle={vehicle} companyData={companyData} />
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailContent;
