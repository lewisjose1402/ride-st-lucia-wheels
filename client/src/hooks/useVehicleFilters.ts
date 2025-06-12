
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useVehicleFilters = () => {
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

  return {
    vehicleTypes: getVehicleTypes(),
    seatOptions: getSeatOptions(),
    maxPrice: getMaxPrice()
  };
};
