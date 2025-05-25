
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  getVehicleAvailability,
  addManualBlock,
  clearAllManualBlocks,
  clearAllCompanyManualBlocks,
  AvailabilityData
} from '@/services/calendarService';
import { format, isSameDay } from 'date-fns';

interface UseInteractiveCalendarProps {
  vehicleId: string;
}

export const useInteractiveCalendar = ({ vehicleId }: UseInteractiveCalendarProps) => {
  const { toast } = useToast();
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAvailability = async () => {
    try {
      setIsLoading(true);
      const data = await getVehicleAvailability(vehicleId);
      setAvailability(data);
    } catch (error) {
      console.error('Error loading availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to load calendar availability',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (vehicleId) {
      loadAvailability();
    }
  }, [vehicleId]);

  const getDateStatus = (date: Date) => {
    const dateEntry = availability.find(item => 
      isSameDay(new Date(item.date), date)
    );
    return dateEntry || { date, status: 'available' as const };
  };

  const handleDateClick = (date: Date) => {
    const dateStatus = getDateStatus(date);
    
    // Prevent interaction with iCal booked dates
    if (dateStatus.status === 'booked-ical') {
      toast({
        title: 'Cannot modify',
        description: 'This date is booked via external calendar',
        variant: 'destructive',
      });
      return;
    }

    // If date is manually blocked, remove the block
    if (dateStatus.status === 'blocked-manual') {
      handleRemoveBlock(date);
      return;
    }

    // Start date selection for blocking
    if (selectedDates.length === 0) {
      setSelectedDates([date]);
    } else if (selectedDates.length === 1) {
      const [startDate] = selectedDates;
      const endDate = date;
      
      if (date < startDate) {
        setSelectedDates([date, startDate]);
      } else {
        setSelectedDates([startDate, date]);
      }
    } else {
      setSelectedDates([date]);
    }
  };

  const handleRemoveBlock = async (date: Date) => {
    try {
      setIsLoading(true);
      await loadAvailability();
      
      toast({
        title: 'Block Removed',
        description: 'The manual block has been removed',
      });
    } catch (error) {
      console.error('Error removing block:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove block',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBlock = async (blockReason: string) => {
    if (selectedDates.length !== 2) return;

    try {
      setIsLoading(true);
      const [startDate, endDate] = selectedDates.sort((a, b) => a.getTime() - b.getTime());
      
      await addManualBlock({
        vehicle_id: vehicleId,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        reason: blockReason || undefined,
      });

      await loadAvailability();
      setSelectedDates([]);
      
      toast({
        title: 'Block Created',
        description: 'Manual block has been created successfully',
      });
    } catch (error) {
      console.error('Error creating block:', error);
      toast({
        title: 'Error',
        description: 'Failed to create block',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearVehicleBlocks = async () => {
    try {
      setIsLoading(true);
      await clearAllManualBlocks(vehicleId);
      await loadAvailability();
      
      toast({
        title: 'Blocks Cleared',
        description: 'All manual blocks for this vehicle have been removed',
      });
    } catch (error) {
      console.error('Error clearing blocks:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear blocks',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAllCompanyBlocks = async () => {
    try {
      setIsLoading(true);
      await clearAllCompanyManualBlocks();
      await loadAvailability();
      
      toast({
        title: 'All Blocks Cleared',
        description: 'All manual blocks for all vehicles have been removed',
      });
    } catch (error) {
      console.error('Error clearing all blocks:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear all blocks',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    availability,
    selectedDates,
    isLoading,
    getDateStatus,
    handleDateClick,
    handleCreateBlock,
    handleClearVehicleBlocks,
    handleClearAllCompanyBlocks,
    setSelectedDates
  };
};
