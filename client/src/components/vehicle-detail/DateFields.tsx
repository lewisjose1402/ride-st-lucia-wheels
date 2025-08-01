
import React from 'react';
import { Label } from '@/components/ui/label';
import AvailabilityDatePicker from './AvailabilityDatePicker';

interface DateFieldsProps {
  vehicleId: string;
  pickupDate: string;
  setPickupDate: (date: string) => void;
  dropoffDate: string;
  setDropoffDate: (date: string) => void;
  minimumRentalDays?: number;
}

const DateFields: React.FC<DateFieldsProps> = ({
  vehicleId,
  pickupDate,
  setPickupDate,
  dropoffDate,
  setDropoffDate,
  minimumRentalDays = 1
}) => {
  const today = new Date();
  const pickupDateObj = pickupDate ? new Date(pickupDate) : undefined;

  console.log('DateFields: minimumRentalDays received:', minimumRentalDays);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="pickupDate" className="text-sm font-medium">
          Pickup Date
        </Label>
        <div className="mt-1">
          <AvailabilityDatePicker
            vehicleId={vehicleId}
            value={pickupDate}
            onSelect={setPickupDate}
            placeholder="Select pickup date"
            minDate={today}
            className="w-full"
            minimumRentalDays={minimumRentalDays}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="dropoffDate" className="text-sm font-medium">
          Dropoff Date
        </Label>
        <div className="mt-1">
          <AvailabilityDatePicker
            vehicleId={vehicleId}
            value={dropoffDate}
            onSelect={setDropoffDate}
            placeholder="Select dropoff date"
            minDate={pickupDateObj || today}
            className="w-full"
            isDropoff={true}
            pickupDate={pickupDate}
            minimumRentalDays={minimumRentalDays}
          />
        </div>
      </div>
    </div>
  );
};

export default DateFields;
