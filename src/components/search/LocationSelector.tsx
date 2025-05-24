
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CONSTITUENCIES } from '@/components/company/profile/constants';

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const LocationSelector = ({ value, onChange }: LocationSelectorProps) => {
  return (
    <div>
      <Label htmlFor="pickupLocation" className="mb-1 block">Pickup Location</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="pickupLocation" className="w-full">
          <SelectValue placeholder="Select pickup location" />
        </SelectTrigger>
        <SelectContent>
          {CONSTITUENCIES.map((constituency) => (
            <SelectItem key={constituency} value={constituency}>
              {constituency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationSelector;
