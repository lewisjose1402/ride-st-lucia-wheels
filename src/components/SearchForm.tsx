
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Vehicle type options
const vehicleTypes = [
  { value: "all", label: "All Vehicle Types" },
  { value: "suv", label: "SUV" },
  { value: "sedan", label: "Sedan" },
  { value: "jeep", label: "Jeep" },
  { value: "van", label: "Van" }
];

// Number of seats options
const seatOptions = [
  { value: "all", label: "Any" },
  { value: "2", label: "2 seats" },
  { value: "4", label: "4 seats" },
  { value: "5", label: "5 seats" },
  { value: "7", label: "7+ seats" }
];

const SearchForm = () => {
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [priceRange, setPriceRange] = useState([50]);
  const [vehicleType, setVehicleType] = useState('all');
  const [seats, setSeats] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just navigate to vehicles page with query params
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
              max={200}
              step={5}
              onValueChange={setPriceRange}
              className="py-4"
            />
          </div>
          
          {/* Vehicle Type */}
          <div>
            <Label htmlFor="vehicleType" className="mb-1 block">Vehicle Type</Label>
            <Select value={vehicleType} onValueChange={setVehicleType}>
              <SelectTrigger id="vehicleType" className="w-full">
                <SelectValue placeholder="Select vehicle type" />
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
