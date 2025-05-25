
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
        console.log('useAvailabilityCheck: Sample date type:', typeof data[0].date, data[0].date);
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

  const formatDateToISO = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const isDateAvailable = (date: Date): boolean => {
    const dateISO = formatDateToISO(date);
    console.log(`useAvailabilityCheck: Checking availability for date ISO: ${dateISO}`);
    
    const hasConflict = availability.some(item => {
      // Ensure item.date is a Date object
      const itemDate = item.date instanceof Date ? item.date : new Date(item.date);
      const itemDateISO = formatDateToISO(itemDate);
      const isConflict = itemDateISO === dateISO &&
        (item.status === 'booked-ical' || item.status === 'blocked-manual');
      
      if (isConflict) {
        console.log(`useAvailabilityCheck: Date ${dateISO} has conflict:`, item);
      }
      
      return isConflict;
    });
    
    console.log(`useAvailabilityCheck: Date ${dateISO} available:`, !hasConflict, 'total availability items:', availability.length);
    return !hasConflict;
  };

  const getDateStatus = (date: Date): AvailabilityData | null => {
    const dateISO = formatDateToISO(date);
    console.log(`useAvailabilityCheck: Getting status for date ISO: ${dateISO}`);
    
    const status = availability.find(item => {
      // Ensure item.date is a Date object
      const itemDate = item.date instanceof Date ? item.date : new Date(item.date);
      const itemDateISO = formatDateToISO(itemDate);
      return itemDateISO === dateISO;
    }) || null;
    
    console.log(`useAvailabilityCheck: getDateStatus for ${dateISO}:`, status, 'from', availability.length, 'total items');
    return status;
  };

  const isDateRangeAvailable = (startDate: Date, endDate: Date): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    console.log('useAvailabilityCheck: Checking date range availability from', formatDateToISO(start), 'to', formatDateToISO(end));
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      if (!isDateAvailable(date)) {
        console.log('useAvailabilityCheck: Date range not available due to:', formatDateToISO(date));
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
