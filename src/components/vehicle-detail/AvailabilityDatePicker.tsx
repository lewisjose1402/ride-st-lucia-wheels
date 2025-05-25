
import React, { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
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
}

const AvailabilityDatePicker: React.FC<AvailabilityDatePickerProps> = ({
  vehicleId,
  value,
  onSelect,
  placeholder,
  minDate = new Date(),
  disabledDates = [],
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  const { availability, isLoading, getDateStatus } = useAvailabilityCheck({ vehicleId });

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const dateStatus = getDateStatus(date);
    
    // Prevent selection of unavailable dates
    if (dateStatus && (dateStatus.status === 'booked-ical' || dateStatus.status === 'blocked-manual')) {
      return;
    }

    setSelectedDate(date);
    onSelect(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const isDateDisabled = (date: Date): boolean => {
    // Check if date is before minimum date
    if (date < minDate) return true;
    
    // Check if date is in disabled dates array
    if (disabledDates.some(disabledDate => isSameDay(disabledDate, date))) return true;
    
    // Check availability status
    const dateStatus = getDateStatus(date);
    return dateStatus?.status === 'booked-ical' || dateStatus?.status === 'blocked-manual';
  };

  const getTooltipContent = (date: Date): string => {
    const dateStatus = getDateStatus(date);
    
    if (!dateStatus) return 'Available';
    
    switch (dateStatus.status) {
      case 'booked-ical':
        return `Unavailable - ${dateStatus.reason || 'External booking'}${dateStatus.feedName ? ` (${dateStatus.feedName})` : ''}`;
      case 'blocked-manual':
        return `Blocked - ${dateStatus.reason || 'Manually blocked'}`;
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
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            modifiers={{
              booked: (date) => {
                const status = getDateStatus(date);
                return status?.status === 'booked-ical';
              },
              blocked: (date) => {
                const status = getDateStatus(date);
                return status?.status === 'blocked-manual';
              },
            }}
            modifiersClassNames={{
              booked: 'bg-red-100 text-red-800 line-through cursor-not-allowed',
              blocked: 'bg-yellow-100 text-yellow-800 cursor-not-allowed',
            }}
            initialFocus
            className="pointer-events-auto"
          />
          
          {/* Legend */}
          <div className="p-3 border-t">
            <div className="text-xs font-medium mb-2">Availability Legend:</div>
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                <span>External Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span>Manually Blocked</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default AvailabilityDatePicker;
