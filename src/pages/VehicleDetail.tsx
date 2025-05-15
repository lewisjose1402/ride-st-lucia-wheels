
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

// Sample vehicle data
const vehicleData = {
  id: 1,
  name: "Jeep Wrangler Sport",
  type: "Jeep",
  company: "Island Car Rentals",
  company_logo: "/logos/island-car-rentals.png",
  price: 89,
  rating: 4.8,
  reviews: 24,
  year: 2022,
  transmission: "Automatic",
  fuel: "Gasoline",
  seats: 4,
  luggage: 3,
  location: "Castries, St. Lucia",
  latitude: 14.0101,
  longitude: -60.9970,
  description: "Experience the rugged beauty of St. Lucia with our Jeep Wrangler Sport. Perfect for exploring the island's diverse terrains, this 4x4 vehicle offers comfort, reliability, and adventure in one package. Its high clearance makes it ideal for navigating St. Lucia's mountainous roads and accessing remote beaches.",
  features: [
    "Air Conditioning", 
    "Bluetooth", 
    "USB Ports", 
    "4-Wheel Drive", 
    "Convertible Top",
    "GPS Navigation",
    "Backup Camera"
  ],
  images: [
    "/vehicles/jeep-wrangler.jpg",
    "/vehicles/jeep-wrangler-interior.jpg",
    "/vehicles/jeep-wrangler-back.jpg",
    "/vehicles/jeep-wrangler-side.jpg"
  ],
  reviews_data: [
    {
      id: 1,
      user: "Michael S.",
      date: "2023-09-15",
      rating: 5,
      comment: "Perfect vehicle for exploring the island. The 4-wheel drive made it easy to navigate the hilly terrain."
    },
    {
      id: 2,
      user: "Jennifer T.",
      date: "2023-08-22",
      rating: 4,
      comment: "Great Jeep, very clean and well-maintained. Pickup was a bit slow but otherwise excellent experience."
    }
  ]
};

const VehicleDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const vehicle = vehicleData; // In a real app, fetch vehicle data based on id
  
  const [selectedImage, setSelectedImage] = useState(vehicle.images[0]);
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  
  if (!vehicle) {
    return <div>Loading...</div>; // Or redirect to not found
  }

  const handleBooking = () => {
    // In a real app, navigate to booking page with vehicle details
    navigate('/booking', { state: { vehicleId: vehicle.id, pickupDate, dropoffDate } });
  };

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
                  <Badge className="bg-brand-purple">{vehicle.type}</Badge>
                </div>
                <div className="flex items-center mt-2">
                  <MapPin size={16} className="text-gray-500 mr-1" />
                  <span className="text-gray-600">{vehicle.location}</span>
                  
                  <div className="flex items-center ml-4">
                    <Star size={16} className="text-brand-orange fill-brand-orange mr-1" />
                    <span className="font-medium">{vehicle.rating}</span>
                    <span className="text-gray-500 ml-1">({vehicle.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              {/* Vehicle images */}
              <div className="mb-8">
                <div className="w-full h-[300px] md:h-[400px] bg-white rounded-lg overflow-hidden mb-2">
                  <img 
                    src={selectedImage} 
                    alt={vehicle.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {vehicle.images.map((image, index) => (
                    <div 
                      key={index} 
                      className={`h-16 md:h-24 bg-white rounded overflow-hidden cursor-pointer
                        ${selectedImage === image ? 'ring-2 ring-brand-purple' : ''}`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img 
                        src={image} 
                        alt={`${vehicle.name} view ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
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
                        {vehicle.year} {vehicle.name} • Available from {vehicle.company}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <Car size={20} className="mx-auto text-brand-purple mb-1" />
                          <p className="text-xs text-gray-500">Type</p>
                          <p className="font-medium">{vehicle.type}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <span className="block text-xl text-brand-purple mb-1">A</span>
                          <p className="text-xs text-gray-500">Transmission</p>
                          <p className="font-medium">{vehicle.transmission}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <span className="block text-xl text-brand-purple mb-1">⛽</span>
                          <p className="text-xs text-gray-500">Fuel</p>
                          <p className="font-medium">{vehicle.fuel}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <span className="block text-xl text-brand-purple mb-1">👤</span>
                          <p className="text-xs text-gray-500">Seats</p>
                          <p className="font-medium">{vehicle.seats}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">
                        {vehicle.description}
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {vehicle.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <Check size={16} className="text-brand-purple mr-2" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews" className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Reviews</CardTitle>
                      <CardDescription>
                        {vehicle.rating} out of 5 stars • {vehicle.reviews} reviews
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {vehicle.reviews_data.map((review) => (
                        <div key={review.id} className="mb-4 pb-4 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium">{review.user}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                className={i < review.rating ? 'text-brand-orange fill-brand-orange' : 'text-gray-300'} 
                              />
                            ))}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
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
                    <span className="text-2xl font-bold">${vehicle.price}</span>
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
                      <img 
                        src={vehicle.company_logo} 
                        alt={vehicle.company} 
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/48?text=CR';
                        }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{vehicle.company}</CardTitle>
                      <CardDescription>Rental Provider</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 mb-4">
                    <p className="mb-2">Reputable car rental company with locations across St. Lucia. Known for quality vehicles and excellent service.</p>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between text-sm">
                    <span>Member since</span>
                    <span className="font-medium">2018</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Response rate</span>
                    <span className="font-medium">98%</span>
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
