
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { VehicleFormValues } from "../VehicleFormTypes";

const AvailabilityToggle = () => {
  const { setValue, watch } = useFormContext<VehicleFormValues>();
  
  return (
    <div className="space-y-2">
      <Label className="mb-2">Availability</Label>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_available"
          checked={watch('is_available')}
          onCheckedChange={(checked) => setValue('is_available', checked as boolean)}
        />
        <Label htmlFor="is_available" className="font-normal">
          This vehicle is available for booking
        </Label>
      </div>
    </div>
  );
};

export default AvailabilityToggle;
