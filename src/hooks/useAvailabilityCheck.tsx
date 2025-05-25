
import { useState, useEffect } from 'react';
import { getVehicleAvailability, AvailabilityData } from '@/services/calendarService';

interface UseAvailabilityCheckProps {
  vehicleId: string;
}

export const useAvailabilityCheck = ({ vehicleId }: UseAvailabilityCheckProps) => {
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAvailability = async () => {
    if (!vehicleId) {
      console.log('No vehicle ID provided');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Starting to load availability for vehicle:', vehicleId);
      const data = await getVehicleAvailability(vehicleId);
      setAvailability(data);
      console.log('Loaded availability data:', data.length, 'blocked dates');
      console.log('Availability details:', data);
    } catch (error) {
      console.error('Error loading availability:', error);
      // Set empty availability on error to allow public access
      setAvailability([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, [vehicleId]);

  const isDateAvailable = (date: Date): boolean => {
    const hasConflict = availability.some(item => {
      const itemDate = new Date(item.date);
      const isConflict = itemDate.toDateString() === date.toDateString() &&
        (item.status === 'booked-ical' || item.status === 'blocked-manual');
      return isConflict;
    });
    
    console.log(`Date ${date.toDateString()} available:`, !hasConflict, 'conflicts found:', hasConflict);
    return !hasConflict;
  };

  const getDateStatus = (date: Date): AvailabilityData | null => {
    const status = availability.find(item => {
      const itemDate = new Date(item.date);
      return itemDate.toDateString() === date.toDateString();
    }) || null;
    
    console.log(`Date ${date.toDateString()} status:`, status);
    return status;
  };

  const isDateRangeAvailable = (startDate: Date, endDate: Date): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      if (!isDateAvailable(date)) {
        return false;
      }
    }
    return true;
  };

  return {
    availability,
    isLoading,
    isDateAvailable,
    getDateStatus,
    isDateRangeAvailable,
    refreshAvailability: loadAvailability
  };
};
