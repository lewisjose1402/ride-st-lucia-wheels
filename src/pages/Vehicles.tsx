
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VehicleCard from '@/components/VehicleCard';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, SlidersHorizontal } from 'lucide-react';

// Sample vehicle data for demonstration
const sampleVehicles = [
  {
    id: 1,
    name: "Jeep Wrangler",
    image: "/vehicles/jeep-wrangler.jpg", 
    type: "Jeep",
    seats: 4,
    transmission: "Automatic",
    price: 89,
    rating: 4.8,
    location: "Castries, St. Lucia",
  },
  {
    id: 2,
    name: "Toyota RAV4",
    image: "/vehicles/toyota-rav4.jpg",
    type: "SUV",
    seats: 5,
    transmission: "Automatic",
    price: 65,
    rating: 4.7,
    location: "Rodney Bay, St. Lucia",
  },
  {
    id: 3,
    name: "Hyundai Tucson",
    image: "/vehicles/hyundai-tucson.jpg",
    type: "SUV",
    seats: 5,
    transmission: "Automatic",
    price: 59,
    rating: 4.6,
    location: "Soufrière, St. Lucia"
  },
  {
    id: 4,
    name: "Suzuki Jimny",
    image: "/vehicles/suzuki-jimny.jpg",
    type: "Jeep",
    seats: 4,
    transmission: "Manual",
    price: 45,
    rating: 4.5,
    location: "Vieux Fort, St. Lucia"
  },
  {
    id: 5,
    name: "Honda Civic",
    image: "/vehicles/honda-civic.jpg",
    type: "Sedan",
    seats: 5,
    transmission: "Automatic",
    price: 50,
    rating: 4.3,
    location: "Castries, St. Lucia"
  },
  {
    id: 6,
    name: "Toyota Hiace",
    image: "/vehicles/toyota-hiace.jpg",
    type: "Van",
    seats: 12,
    transmission: "Automatic",
    price: 110,
    rating: 4.4,
    location: "Rodney Bay, St. Lucia"
  },
  {
    id: 7,
    name: "Nissan X-Trail",
    image: "/vehicles/nissan-xtrail.jpg",
    type: "SUV",
    seats: 5,
    transmission: "Automatic",
    price: 70,
    rating: 4.2,
    location: "Soufrière, St. Lucia"
  },
  {
    id: 8,
    name: "Kia Sportage",
    image: "/vehicles/kia-sportage.jpg",
    type: "SUV",
    seats: 5,
    transmission: "Automatic",
    price: 68,
    rating: 4.5,
    location: "Rodney Bay, St. Lucia"
  }
];

const VehiclesPage = () => {
  const location = useLocation();
  const searchParams = location.state || {};
  
  const [vehicles, setVehicles] = useState(sampleVehicles);
  const [filteredVehicles, setFilteredVehicles] = useState(sampleVehicles);
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  
  // Filter states
  const [vehicleType, setVehicleType] = useState(searchParams.vehicleType || 'all');
  const [seats, setSeats] = useState(searchParams.seats || 'all');
  const [priceRange, setPriceRange] = useState([searchParams.priceRange || 100]);
  const [sortBy, setSortBy] = useState('recommended');
  
  // Form values from search
  const [pickupLocation] = useState(searchParams.pickupLocation || '');
  const [dropoffLocation] = useState(searchParams.dropoffLocation || '');
  const [pickupDate] = useState(searchParams.pickupDate || '');
  const [dropoffDate] = useState(searchParams.dropoffDate || '');

  // Apply filters
  useEffect(() => {
    let filtered = [...vehicles];
    
    // Filter by vehicle type
    if (vehicleType !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.type.toLowerCase() === vehicleType.toLowerCase());
    }
    
    // Filter by seats
    if (seats !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.seats >= parseInt(seats));
    }
    
    // Filter by price
    filtered = filtered.filter(vehicle => vehicle.price <= priceRange[0]);
    
    // Sort results
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    
    setFilteredVehicles(filtered);
  }, [vehicles, vehicleType, seats, priceRange, sortBy]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 bg-gray-50">
        {/* Search summary */}
        <div className="bg-brand-purple text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex flex-wrap items-center space-x-4">
                <div>
                  <span className="text-sm opacity-80">Pickup/Dropoff:</span>
                  <p className="font-medium">{pickupLocation || 'Any Location'}</p>
                </div>
                <div>
                  <span className="text-sm opacity-80">Dates:</span>
                  <p className="font-medium">
                    {pickupDate ? new Date(pickupDate).toLocaleDateString() : 'Any'} - {' '}
                    {dropoffDate ? new Date(dropoffDate).toLocaleDateString() : 'Any'}
                  </p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-brand-purple-dark mt-2 sm:mt-0"
                onClick={() => setIsFilterMobileOpen(!isFilterMobileOpen)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Modify Search
              </Button>
            </div>
          </div>
        </div>
        
        {/* Modified search form (collapsible on mobile) */}
        {isFilterMobileOpen && (
          <div className="bg-white border-b shadow-sm py-4">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Pickup/Dropoff</label>
                  <Input 
                    type="text" 
                    placeholder="Location" 
                    value={pickupLocation} 
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Pickup Date</label>
                  <div className="relative mt-1">
                    <Input
                      type="date"
                      value={pickupDate}
                      className="w-full"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Dropoff Date</label>
                  <div className="relative mt-1">
                    <Input
                      type="date"
                      value={dropoffDate}
                      className="w-full"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>
                <div>
                  <Button className="w-full bg-brand-purple hover:bg-brand-purple-dark mt-5">
                    Update Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters - sidebar */}
            <div className="md:w-1/4 bg-white p-4 rounded-lg shadow-sm h-fit">
              <h2 className="text-xl font-bold text-brand-dark mb-4">Filters</h2>
              
              {/* Vehicle Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Vehicle Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vehicle Types</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="jeep">Jeep</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Seats */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seats
                </label>
                <Select value={seats} onValueChange={setSeats}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any number of seats" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="2">2+ seats</SelectItem>
                    <SelectItem value="4">4+ seats</SelectItem>
                    <SelectItem value="5">5+ seats</SelectItem>
                    <SelectItem value="7">7+ seats</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Price Range */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Max Price per Day
                  </label>
                  <span className="text-sm text-brand-purple font-semibold">
                    ${priceRange[0]}
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  min={10}
                  max={200}
                  step={5}
                  onValueChange={setPriceRange}
                />
              </div>
              
              {/* Reset Filters */}
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => {
                  setVehicleType('all');
                  setSeats('all');
                  setPriceRange([100]);
                }}
              >
                Reset Filters
              </Button>
            </div>
            
            {/* Results */}
            <div className="md:w-3/4">
              {/* Sort controls */}
              <div className="flex flex-wrap justify-between items-center mb-4">
                <p className="text-gray-600 mb-2 md:mb-0">
                  <strong>{filteredVehicles.length}</strong> vehicles available
                </p>
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-700">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Recommended" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Results grid */}
              {filteredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVehicles.map(vehicle => (
                    <VehicleCard key={vehicle.id} {...vehicle} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No vehicles match your filters</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setVehicleType('all');
                      setSeats('all');
                      setPriceRange([100]);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VehiclesPage;
