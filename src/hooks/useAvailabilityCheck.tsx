
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
      console.log('useAvailabilityCheck: No vehicle ID provided');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('useAvailabilityCheck: Starting to load availability for vehicle:', vehicleId);
      const data = await getVehicleAvailability(vehicleId);
      console.log('useAvailabilityCheck: Raw availability data received:', data);
      setAvailability(data);
      console.log('useAvailabilityCheck: Availability state updated with', data.length, 'items');
      
      // Log a sample of the data for debugging
      if (data.length > 0) {
        console.log('useAvailabilityCheck: Sample availability item:', data[0]);
      }
    } catch (error) {
      console.error('useAvailabilityCheck: Error loading availability:', error);
      // Set empty availability on error to allow public access
      setAvailability([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('useAvailabilityCheck: useEffect triggered with vehicleId:', vehicleId);
    loadAvailability();
  }, [vehicleId]);

  const isDateAvailable = (date: Date): boolean => {
    const dateString = date.toDateString();
    const hasConflict = availability.some(item => {
      const itemDate = new Date(item.date);
      const itemDateString = itemDate.toDateString();
      const isConflict = itemDateString === dateString &&
        (item.status === 'booked-ical' || item.status === 'blocked-manual');
      
      if (isConflict) {
        console.log(`useAvailabilityCheck: Date ${dateString} has conflict:`, item);
      }
      
      return isConflict;
    });
    
    console.log(`useAvailabilityCheck: Date ${dateString} available:`, !hasConflict, 'total availability items:', availability.length);
    return !hasConflict;
  };

  const getDateStatus = (date: Date): AvailabilityData | null => {
    const dateString = date.toDateString();
    const status = availability.find(item => {
      const itemDate = new Date(item.date);
      const itemDateString = itemDate.toDateString();
      return itemDateString === dateString;
    }) || null;
    
    console.log(`useAvailabilityCheck: getDateStatus for ${dateString}:`, status, 'from', availability.length, 'total items');
    return status;
  };

  const isDateRangeAvailable = (startDate: Date, endDate: Date): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    console.log('useAvailabilityCheck: Checking date range availability from', start.toDateString(), 'to', end.toDateString());
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      if (!isDateAvailable(date)) {
        console.log('useAvailabilityCheck: Date range not available due to:', date.toDateString());
        return false;
      }
    }
    console.log('useAvailabilityCheck: Date range is available');
    return true;
  };

  console.log('useAvailabilityCheck: Returning hook values with availability length:', availability.length);

  return {
    availability,
    isLoading,
    isDateAvailable,
    getDateStatus,
    isDateRangeAvailable,
    refreshAvailability: loadAvailability
  };
};
