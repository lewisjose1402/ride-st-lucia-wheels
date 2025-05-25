import { Button } from '@/components/ui/button';
interface BookingActionsProps {
  onBooking: () => void;
  isValid: boolean;
}
const BookingActions = ({
  onBooking,
  isValid
}: BookingActionsProps) => {
  return <>
      <Button className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white" onClick={onBooking} disabled={!isValid}>
        Book Now
      </Button>
      
      <div className="text-center text-sm text-gray-500 mt-2">Only 12% deposit required to confirm</div>
    </>;
};
export default BookingActions;