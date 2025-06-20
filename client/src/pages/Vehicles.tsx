
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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

const VehiclesPage = () => {
  const location = useLocation();
  
  // Get search params from localStorage (set by SearchForm component)
  const [searchParams, setSearchParams] = useState(() => {
    const storedParams = localStorage.getItem('vehicleSearchParams');
    return storedParams ? JSON.parse(storedParams) : {};
  });
  
  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([]);
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  
  // Filter states
  const [vehicleType, setVehicleType] = useState(searchParams.vehicleType || 'all');
  const [seats, setSeats] = useState(searchParams.seats || 'all');
  const [priceRange, setPriceRange] = useState([searchParams.priceRange || 200]);
  const [sortBy, setSortBy] = useState('recommended');
  
  // Form values from search
  const [pickupLocation] = useState(searchParams.pickupLocation || '');
  const [dropoffLocation] = useState(searchParams.dropoffLocation || '');
  const [pickupDate] = useState(searchParams.pickupDate || '');
  const [dropoffDate] = useState(searchParams.dropoffDate || '');

  // Fetch vehicles from Supabase
  const { data: vehicles = [], isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      console.log('Fetching vehicles from database...');
      
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          vehicle_images(*),
          rental_companies(company_name)
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vehicles:', error);
        throw new Error(error.message);
      }

      console.log('Fetched vehicles:', data);
      return data || [];
    },
  });

  // Apply filters
  useEffect(() => {
    if (!vehicles) return;
    
    let filtered = [...vehicles];
    
    // Filter by vehicle type (using transmission as a proxy since we don't have vehicle_type field)
    if (vehicleType !== 'all') {
      filtered = filtered.filter(vehicle => {
        // Map transmission types to general vehicle categories
        const transmission = vehicle.transmission?.toLowerCase() || '';
        if (vehicleType === 'automatic') {
          return transmission.includes('automatic');
        } else if (vehicleType === 'manual') {
          return transmission.includes('manual');
        }
        return true;
      });
    }
    
    // Filter by seats
    if (seats !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.seats >= parseInt(seats));
    }
    
    // Filter by price
    filtered = filtered.filter(vehicle => vehicle.price_per_day <= priceRange[0]);
    
    // Sort results
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price_per_day - b.price_per_day);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price_per_day - a.price_per_day);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    
    setFilteredVehicles(filtered);
  }, [vehicles, vehicleType, seats, priceRange, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
              <p className="text-gray-600">Loading vehicles...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Vehicles</h1>
              <p className="text-gray-600 mb-4">We're having trouble loading the vehicles. Please try again later.</p>
              <Button onClick={() => window.location.reload()} className="bg-brand-purple hover:bg-brand-purple-dark">
                Try Again
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                variant="secondary" 
                className="bg-white text-brand-purple hover:bg-gray-100 border-white mt-2 sm:mt-0"
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
              
              {/* Transmission Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission
                </label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Transmissions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transmissions</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
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
                  setPriceRange([200]);
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
                  {filteredVehicles.map(vehicle => {
                    // Get the primary image or first available image
                    const primaryImage = vehicle.vehicle_images?.find(img => img.is_primary);
                    const imageUrl = primaryImage?.image_url || vehicle.vehicle_images?.[0]?.image_url || '/placeholder.svg';
                    
                    return (
                      <VehicleCard 
                        key={vehicle.id}
                        id={vehicle.id}
                        name={vehicle.name}
                        image={imageUrl}
                        type={vehicle.transmission || 'Vehicle'}
                        seats={vehicle.seats}
                        transmission={vehicle.transmission}
                        price={vehicle.price_per_day}
                        rating={vehicle.rating || 4.0}
                        location={vehicle.location}
                        featured={vehicle.is_featured}
                      />
                    );
                  })}
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
                      setPriceRange([200]);
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
