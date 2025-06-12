
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';

interface BookingInfo {
  id: string;
  first_name: string;
  last_name: string;
  pickup_date: string;
  dropoff_date: string;
  driver_name: string;
}

interface BookingDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingInfo | null;
}

const BookingDetailsDialog = ({ 
  isOpen, 
  onClose, 
  booking 
}: BookingDetailsDialogProps) => {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmed Booking Details</DialogTitle>
          <DialogDescription>
            Review the details of this confirmed booking.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-gray-700">Renter Name</h4>
            <p className="text-sm">
              {booking.first_name} {booking.last_name}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-700">Driver Name</h4>
            <p className="text-sm">
              {booking.driver_name}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-700">Pickup Date</h4>
            <p className="text-sm">
              {format(new Date(booking.pickup_date), 'MMM dd, yyyy')}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-700">Drop-off Date</h4>
            <p className="text-sm">
              {format(new Date(booking.dropoff_date), 'MMM dd, yyyy')}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-700">Booking ID</h4>
            <p className="text-sm text-gray-600">
              {booking.id}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsDialog;
