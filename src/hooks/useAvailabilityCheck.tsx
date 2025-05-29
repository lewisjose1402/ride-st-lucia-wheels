
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
      console.log('useAvailabilityCheck: Availability state updated with', data.length, 'blocked dates');
      
      // Log detailed information about blocked dates
      if (data.length > 0) {
        console.log('useAvailabilityCheck: Sample availability items:', data.slice(0, 5));
        const manualBlocks = data.filter(item => item.status === 'blocked-manual');
        const icalBlocks = data.filter(item => item.status === 'booked-ical');
        const confirmedBookings = data.filter(item => item.status === 'booked-confirmed');
        console.log(`useAvailabilityCheck: Found ${manualBlocks.length} manual blocks, ${icalBlocks.length} iCal blocks, and ${confirmedBookings.length} confirmed bookings`);
      } else {
        console.log('useAvailabilityCheck: No blocked dates found - vehicle is fully available');
      }
    } catch (error) {
      console.error('useAvailabilityCheck: Error loading availability:', error);
      // Set empty availability on error to allow public access fallback
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
    // Use toISOString and split to get YYYY-MM-DD format consistently
    return date.toISOString().split('T')[0];
  };

  const isDateAvailable = (date: Date): boolean => {
    const dateISO = formatDateToISO(date);
    console.log(`useAvailabilityCheck: Checking availability for date: ${dateISO}`);
    
    const hasConflict = availability.some(item => {
      // Ensure consistent date comparison using ISO format
      const itemDate = item.date instanceof Date ? item.date : new Date(item.date);
      const itemDateISO = formatDateToISO(itemDate);
      const isConflict = itemDateISO === dateISO &&
        (item.status === 'booked-ical' || item.status === 'blocked-manual' || item.status === 'booked-confirmed');
      
      if (isConflict) {
        console.log(`useAvailabilityCheck: Date ${dateISO} has conflict:`, {
          status: item.status,
          reason: item.reason,
          source: item.source,
          isBooking: item.isBooking
        });
      }
      
      return isConflict;
    });
    
    const isAvailable = !hasConflict;
    console.log(`useAvailabilityCheck: Date ${dateISO} available: ${isAvailable} (total blocked dates: ${availability.length})`);
    return isAvailable;
  };

  const getDateStatus = (date: Date): AvailabilityData | null => {
    const dateISO = formatDateToISO(date);
    
    const status = availability.find(item => {
      // Ensure consistent date comparison using ISO format
      const itemDate = item.date instanceof Date ? item.date : new Date(item.date);
      const itemDateISO = formatDateToISO(itemDate);
      return itemDateISO === dateISO;
    }) || null;
    
    if (status) {
      console.log(`useAvailabilityCheck: getDateStatus for ${dateISO}:`, status);
    }
    return status;
  };

  const isDateRangeAvailable = (startDate: Date, endDate: Date): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    console.log('useAvailabilityCheck: Checking date range availability from', formatDateToISO(start), 'to', formatDateToISO(end));
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      if (!isDateAvailable(date)) {
        console.log('useAvailabilityCheck: Date range not available due to conflict on:', formatDateToISO(date));
        return false;
      }
    }
    console.log('useAvailabilityCheck: Date range is fully available');
    return true;
  };

  console.log('useAvailabilityCheck: Hook returning values - availability length:', availability.length, 'isLoading:', isLoading);

  return {
    availability,
    isLoading,
    isDateAvailable,
    getDateStatus,
    isDateRangeAvailable,
    refreshAvailability: loadAvailability
  };
};
