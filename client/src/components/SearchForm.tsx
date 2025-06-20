
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useVehicleFilters } from '@/hooks/useVehicleFilters';
import LocationSelector from './search/LocationSelector';
import DateInputs from './search/DateInputs';
import FilterControls from './search/FilterControls';

const SearchForm = () => {
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [priceRange, setPriceRange] = useState([50]);
  const [vehicleType, setVehicleType] = useState('all');
  const [seats, setSeats] = useState('all');

  const { vehicleTypes, seatOptions, maxPrice } = useVehicleFilters();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Store search params in localStorage for vehicles page to read
    localStorage.setItem('vehicleSearchParams', JSON.stringify({
      pickupLocation,
      pickupDate,
      dropoffDate,
      priceRange: priceRange[0],
      vehicleType,
      seats
    }));
    navigate('/vehicles');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSearch}>
        <div className="mb-4">
          <LocationSelector 
            value={pickupLocation} 
            onChange={setPickupLocation} 
          />
        </div>

        <DateInputs
          pickupDate={pickupDate}
          dropoffDate={dropoffDate}
          onPickupDateChange={setPickupDate}
          onDropoffDateChange={setDropoffDate}
        />

        <FilterControls
          priceRange={priceRange}
          vehicleType={vehicleType}
          seats={seats}
          onPriceRangeChange={setPriceRange}
          onVehicleTypeChange={setVehicleType}
          onSeatsChange={setSeats}
          vehicleTypes={vehicleTypes}
          seatOptions={seatOptions}
          maxPrice={maxPrice}
        />

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
