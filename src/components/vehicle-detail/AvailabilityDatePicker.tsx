
import React, { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format, isSameDay, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAvailabilityCheck } from '@/hooks/useAvailabilityCheck';

interface AvailabilityDatePickerProps {
  vehicleId: string;
  value?: string;
  onSelect: (date: string) => void;
  placeholder: string;
  minDate?: Date;
  disabledDates?: Date[];
  className?: string;
  isDropoff?: boolean;
  pickupDate?: string;
  minimumRentalDays?: number;
}

const AvailabilityDatePicker: React.FC<AvailabilityDatePickerProps> = ({
  vehicleId,
  value,
  onSelect,
  placeholder,
  minDate = new Date(),
  disabledDates = [],
  className,
  isDropoff = false,
  pickupDate,
  minimumRentalDays = 1
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  const { availability, isLoading, getDateStatus, isDateAvailable } = useAvailabilityCheck({ vehicleId });

  console.log('AvailabilityDatePicker: Rendered for vehicle:', vehicleId, 'with', availability.length, 'blocked dates');
  console.log('AvailabilityDatePicker: minimumRentalDays:', minimumRentalDays, 'isDropoff:', isDropoff, 'pickupDate:', pickupDate);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    console.log('AvailabilityDatePicker: Attempting to select date:', date.toISOString().split('T')[0]);
    
    // Check if date is available using the hook
    const available = isDateAvailable(date);
    if (!available) {
      console.log('AvailabilityDatePicker: Date selection blocked - date not available');
      return;
    }

    // For dropoff dates, check minimum rental period
    if (isDropoff && pickupDate) {
      const pickup = new Date(pickupDate);
      const daysDifference = differenceInDays(date, pickup);
      console.log('AvailabilityDatePicker: Days difference:', daysDifference, 'minimum required:', minimumRentalDays);
      
      if (daysDifference < minimumRentalDays) {
        console.log('AvailabilityDatePicker: Date selection blocked - below minimum rental days');
        return;
      }
    }

    console.log('AvailabilityDatePicker: Date selection allowed - date is available');
    setSelectedDate(date);
    onSelect(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const isDateDisabled = (date: Date): boolean => {
    // Check if date is before minimum date
    if (date < minDate) {
      return true;
    }
    
    // Check if date is in disabled dates array
    if (disabledDates.some(disabledDate => isSameDay(disabledDate, date))) {
      return true;
    }
    
    // For dropoff dates, check minimum rental period
    if (isDropoff && pickupDate) {
      const pickup = new Date(pickupDate);
      const daysDifference = differenceInDays(date, pickup);
      if (daysDifference < minimumRentalDays) {
        return true;
      }
    }
    
    // Check availability status using the hook
    const available = isDateAvailable(date);
    return !available;
  };

  const getTooltipContent = (date: Date): string => {
    // For dropoff dates, check minimum rental period first
    if (isDropoff && pickupDate) {
      const pickup = new Date(pickupDate);
      const daysDifference = differenceInDays(date, pickup);
      if (daysDifference < minimumRentalDays) {
        return `Minimum rental period is ${minimumRentalDays} day${minimumRentalDays > 1 ? 's' : ''}`;
      }
    }

    const dateStatus = getDateStatus(date);
    
    if (!dateStatus) return 'Available';
    
    switch (dateStatus.status) {
      case 'booked-ical':
        return `Unavailable - ${dateStatus.reason || 'External booking'}${dateStatus.feedName ? ` (${dateStatus.feedName})` : ''}`;
      case 'blocked-manual':
        return `Blocked - ${dateStatus.reason || 'Manually blocked'}`;
      case 'booked-confirmed':
        return `Unavailable - ${dateStatus.reason || 'Confirmed booking'}`;
      default:
        return 'Available';
    }
  };

  return (
    <TooltipProvider>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
              className
            )}
            disabled={isLoading}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {isLoading ? 'Loading...' : selectedDate ? format(selectedDate, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            modifiers={{
              unavailable: (date) => {
                const status = getDateStatus(date);
                return status?.status === 'booked-ical' || status?.status === 'blocked-manual' || status?.status === 'booked-confirmed';
              },
              belowMinimum: (date) => {
                if (isDropoff && pickupDate) {
                  const pickup = new Date(pickupDate);
                  const daysDifference = differenceInDays(date, pickup);
                  return daysDifference < minimumRentalDays;
                }
                return false;
              },
            }}
            modifiersClassNames={{
              unavailable: 'bg-gray-100 text-gray-500 cursor-not-allowed',
              belowMinimum: 'bg-red-100 text-red-500 cursor-not-allowed',
            }}
            initialFocus
            className="pointer-events-auto"
          />
          
          {/* Legend */}
          <div className="p-3 border-t">
            <div className="text-xs font-medium mb-2">
              Availability Status ({availability.length} blocked dates)
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                <span>Unavailable</span>
              </div>
              {isDropoff && minimumRentalDays > 1 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                  <span>Below minimum rental period ({minimumRentalDays} days)</span>
                </div>
              )}
            </div>
            {isLoading && (
              <div className="text-xs text-gray-500 mt-2">
                Loading availability...
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default AvailabilityDatePicker;
