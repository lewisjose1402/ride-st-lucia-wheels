
import { useState, useEffect } from 'react';
import { getVehicleAvailability, AvailabilityData } from '@/services/calendarService';

interface UseAvailabilityCheckProps {
  vehicleId: string;
}

export const useAvailabilityCheck = ({ vehicleId }: UseAvailabilityCheckProps) => {
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAvailability = async () => {
    if (!vehicleId) return;
    
    try {
      setIsLoading(true);
      const data = await getVehicleAvailability(vehicleId);
      setAvailability(data);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, [vehicleId]);

  const isDateAvailable = (date: Date): boolean => {
    return !availability.some(item => {
      const itemDate = new Date(item.date);
      return (
        itemDate.toDateString() === date.toDateString() &&
        (item.status === 'booked-ical' || item.status === 'blocked-manual')
      );
    });
  };

  const getDateStatus = (date: Date): AvailabilityData | null => {
    return availability.find(item => {
      const itemDate = new Date(item.date);
      return itemDate.toDateString() === date.toDateString();
    }) || null;
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
