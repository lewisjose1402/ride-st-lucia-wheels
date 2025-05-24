
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Star, Calendar, Check, Car, MapPin } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getVehicle } from '@/services/vehicleService';
import { getAddressFromLocationData } from '@/utils/locationHelpers';

const VehicleDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');

  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => getVehicle(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (vehicle?.vehicle_images?.length > 0) {
      const primaryImage = vehicle.vehicle_images.find(img => img.is_primary);
      setSelectedImage(primaryImage?.image_url || vehicle.vehicle_images[0]?.image_url || '/placeholder.svg');
    }
  }, [vehicle]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 pb-12 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="h-64 bg-gray-200 rounded mb-4"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
                <div>
                  <div className="h-48 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 pb-12 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Vehicle Not Found</h1>
              <p className="text-gray-600 mb-4">The vehicle you're looking for doesn't exist or is no longer available.</p>
              <Button onClick={() => navigate('/vehicles')} className="bg-brand-purple hover:bg-brand-purple-dark">
                Browse All Vehicles
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBooking = () => {
    navigate('/booking', { state: { vehicleId: vehicle.id, pickupDate, dropoffDate } });
  };

  // Format location for display
  const formatLocationDisplay = (loc: any): string => {
    if (typeof loc === 'string') return loc;
    
    const { street_address, constituency } = getAddressFromLocationData(loc);
    const parts = [];
    if (street_address) parts.push(street_address);
    if (constituency) parts.push(constituency);
    
    return parts.join(', ') || "St. Lucia";
  };

  // Get vehicle type from features or default
  const getVehicleType = () => {
    return vehicle.vehicle_type || 'Vehicle';
  };

  // Get features array from vehicle.features object
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
  const images = vehicle.vehicle_images || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-12 bg-gray-50">
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
              {/* Vehicle name and type */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-brand-dark">{vehicle.name}</h1>
                  <Badge className="bg-brand-purple">{getVehicleType()}</Badge>
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
              
              {/* Vehicle images */}
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
                    {images.map((image, index) => (
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
              
              {/* Tabs for Description, Features, Reviews */}
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
                          <p className="font-medium">{getVehicleType()}</p>
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
            
            {/* Right column - Booking and company info */}
            <div>
              {/* Pricing card */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>
                    <span className="text-2xl font-bold">${vehicle.price_per_day}</span>
                    <span className="text-gray-500 text-base font-normal"> / day</span>
                  </CardTitle>
                  <CardDescription>Inclusive of standard insurance</CardDescription>
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
                      onClick={handleBooking}
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
              
              {/* Rental company info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 mr-3">
                      <div className="h-full w-full bg-brand-purple text-white flex items-center justify-center text-lg font-bold">
                        RC
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Rental Company</CardTitle>
                      <CardDescription>Vehicle Provider</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 mb-4">
                    <p className="mb-2">Quality vehicle rental service in St. Lucia.</p>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between text-sm">
                    <span>Status</span>
                    <span className="font-medium text-green-600">Available</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Response rate</span>
                    <span className="font-medium">95%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VehicleDetailPage;
