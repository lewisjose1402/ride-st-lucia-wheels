
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface FilterControlsProps {
  priceRange: number[];
  vehicleType: string;
  seats: string;
  onPriceRangeChange: (value: number[]) => void;
  onVehicleTypeChange: (value: string) => void;
  onSeatsChange: (value: string) => void;
  vehicleTypes: Array<{ value: string; label: string }>;
  seatOptions: Array<{ value: string; label: string }>;
  maxPrice: number;
}

const FilterControls = ({
  priceRange,
  vehicleType,
  seats,
  onPriceRangeChange,
  onVehicleTypeChange,
  onSeatsChange,
  vehicleTypes,
  seatOptions,
  maxPrice
}: FilterControlsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Daily Budget */}
      <div>
        <div className="flex justify-between mb-1">
          <Label htmlFor="priceRange">Daily Budget</Label>
          <span className="text-sm text-brand-purple font-semibold">${priceRange[0]}/day</span>
        </div>
        <Slider
          id="priceRange"
          value={priceRange}
          min={10}
          max={maxPrice}
          step={5}
          onValueChange={onPriceRangeChange}
          className="py-4"
        />
      </div>
      
      {/* Vehicle Type */}
      <div>
        <Label htmlFor="vehicleType" className="mb-1 block">Transmission</Label>
        <Select value={vehicleType} onValueChange={onVehicleTypeChange}>
          <SelectTrigger id="vehicleType" className="w-full">
            <SelectValue placeholder="Select transmission" />
          </SelectTrigger>
          <SelectContent>
            {vehicleTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Number of Seats */}
      <div>
        <Label htmlFor="seats" className="mb-1 block">Number of Seats</Label>
        <Select value={seats} onValueChange={onSeatsChange}>
          <SelectTrigger id="seats" className="w-full">
            <SelectValue placeholder="Select seats" />
          </SelectTrigger>
          <SelectContent>
            {seatOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterControls;
