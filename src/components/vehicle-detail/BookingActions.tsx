
import { Button } from '@/components/ui/button';
import { useAvailabilityCheck } from '@/hooks/useAvailabilityCheck';
import { debugBookingRLS } from '@/utils/debugBookingRLS';

interface BookingActionsProps {
  onBooking: () => void;
  isValid: boolean;
  vehicleId?: string;
  pickupDate?: string;
  dropoffDate?: string;
  isProcessing?: boolean;
}

const BookingActions = ({
  onBooking,
  isValid,
  vehicleId,
  pickupDate,
  dropoffDate,
  isProcessing = false
}: BookingActionsProps) => {
  const { isDateRangeAvailable } = useAvailabilityCheck({ 
    vehicleId: vehicleId || '' 
  });

  const checkAvailability = () => {
    if (!pickupDate || !dropoffDate || !vehicleId) return true;
    
    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);
    
    return isDateRangeAvailable(start, end);
  };

  const isAvailable = checkAvailability();
  const isBookingValid = isValid && isAvailable;

  console.log('BookingActions state:', {
    isValid,
    isAvailable,
    isBookingValid,
    isProcessing,
    pickupDate: pickupDate ? 'set' : 'not set',
    dropoffDate: dropoffDate ? 'set' : 'not set'
  });

  const handleDebugRLS = async () => {
    await debugBookingRLS();
  };

  return (
    <>
      <Button 
        className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white" 
        onClick={onBooking} 
        disabled={!isBookingValid || isProcessing}
      >
        {isProcessing ? 'Processing...' : !isAvailable ? 'Dates Unavailable' : 'Book Now'}
      </Button>
      
      {/* Temporary debug button - remove after fixing */}
      <Button 
        variant="outline"
        className="w-full mt-2" 
        onClick={handleDebugRLS}
      >
        Debug RLS (Dev Only)
      </Button>
      
      <div className="text-center text-sm text-gray-500 mt-2">
        {isAvailable ? 'Only 12% deposit required to confirm' : 'Selected dates are not available'}
      </div>
    </>
  );
};

export default BookingActions;
