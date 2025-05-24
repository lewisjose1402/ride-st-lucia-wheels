
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from 'lucide-react';

interface DateInputsProps {
  pickupDate: string;
  dropoffDate: string;
  onPickupDateChange: (date: string) => void;
  onDropoffDateChange: (date: string) => void;
}

const DateInputs = ({ 
  pickupDate, 
  dropoffDate, 
  onPickupDateChange, 
  onDropoffDateChange 
}: DateInputsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {/* Pickup Date */}
      <div>
        <Label htmlFor="pickupDate" className="mb-1 block">Pickup Date</Label>
        <div className="relative">
          <Input
            id="pickupDate"
            type="date"
            value={pickupDate}
            onChange={(e) => onPickupDateChange(e.target.value)}
            required
            className="w-full"
            min={new Date().toISOString().split('T')[0]}
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
      
      {/* Dropoff Date */}
      <div>
        <Label htmlFor="dropoffDate" className="mb-1 block">Dropoff Date</Label>
        <div className="relative">
          <Input
            id="dropoffDate"
            type="date"
            value={dropoffDate}
            onChange={(e) => onDropoffDateChange(e.target.value)}
            required
            className="w-full"
            min={pickupDate || new Date().toISOString().split('T')[0]}
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
    </div>
  );
};

export default DateInputs;
