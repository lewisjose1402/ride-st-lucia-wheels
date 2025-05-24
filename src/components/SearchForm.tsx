
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SearchForm = () => {
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [priceRange, setPriceRange] = useState([50]);
  const [vehicleType, setVehicleType] = useState('all');
  const [seats, setSeats] = useState('all');

  // Fetch vehicles to get actual data for filters
  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles-for-filters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('transmission, seats, price_per_day')
        .eq('is_available', true);

      if (error) {
        console.error('Error fetching vehicles for filters:', error);
        return [];
      }

      return data || [];
    },
  });

  // Get unique transmission types from actual vehicles
  const getVehicleTypes = () => {
    const transmissions = vehicles
      .map(v => v.transmission)
      .filter((transmission, index, arr) => 
        transmission && arr.indexOf(transmission) === index
      )
      .sort();

    return [
      { value: "all", label: "All Transmissions" },
      ...transmissions.map(transmission => ({
        value: transmission.toLowerCase(),
        label: transmission
      }))
    ];
  };

  // Get unique seat counts from actual vehicles
  const getSeatOptions = () => {
    const seatCounts = vehicles
      .map(v => v.seats)
      .filter((seats, index, arr) => 
        seats && arr.indexOf(seats) === index
      )
      .sort((a, b) => a - b);

    return [
      { value: "all", label: "Any" },
      ...seatCounts.map(seatCount => ({
        value: seatCount.toString(),
        label: `${seatCount} seats`
      }))
    ];
  };

  // Get max price from actual vehicles
  const getMaxPrice = () => {
    if (vehicles.length === 0) return 200;
    const maxPrice = Math.max(...vehicles.map(v => v.price_per_day || 0));
    return Math.ceil(maxPrice / 10) * 10; // Round up to nearest 10
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/vehicles', { 
      state: { 
        pickupLocation,
        pickupDate,
        dropoffDate,
        priceRange: priceRange[0],
        vehicleType,
        seats
      } 
    });
  };

  const vehicleTypes = getVehicleTypes();
  const seatOptions = getSeatOptions();
  const maxPrice = getMaxPrice();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSearch}>
        <div className="mb-4">
          {/* Pickup Location */}
          <div>
            <Label htmlFor="pickupLocation" className="mb-1 block">Pickup Location</Label>
            <Input
              id="pickupLocation"
              placeholder="Enter pickup location"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              required
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Pickup Date */}
          <div>
            <Label htmlFor="pickupDate" className="mb-1 block">Pickup Date</Label>
            <div className="relative">
              <Input
                id="pickupDate"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
                className="w-full"
                min={new Date().toISOString().split('T')[0]}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          
          {/* Dropoff Date */}
          <div>
            <Label htmlFor="dropoffDate" className="mb-1 block">Dropoff Date</Label>
            <div className="relative">
              <Input
                id="dropoffDate"
                type="date"
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                required
                className="w-full"
                min={pickupDate || new Date().toISOString().split('T')[0]}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Daily Budget */}
          <div>
            <div className="flex justify-between mb-1">
              <Label htmlFor="priceRange">Daily Budget</Label>
              <span className="text-sm text-brand-purple font-semibold">${priceRange[0]}/day</span>
            </div>
            <Slider
              id="priceRange"
              value={priceRange}
              min={10}
              max={maxPrice}
              step={5}
              onValueChange={setPriceRange}
              className="py-4"
            />
          </div>
          
          {/* Vehicle Type */}
          <div>
            <Label htmlFor="vehicleType" className="mb-1 block">Transmission</Label>
            <Select value={vehicleType} onValueChange={setVehicleType}>
              <SelectTrigger id="vehicleType" className="w-full">
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Number of Seats */}
          <div>
            <Label htmlFor="seats" className="mb-1 block">Number of Seats</Label>
            <Select value={seats} onValueChange={setSeats}>
              <SelectTrigger id="seats" className="w-full">
                <SelectValue placeholder="Select seats" />
              </SelectTrigger>
              <SelectContent>
                {seatOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-brand-purple hover:bg-brand-purple-dark text-white py-3 text-lg"
        >
          Search Available Vehicles
        </Button>
      </form>
    </div>
  );
};

export default SearchForm;
