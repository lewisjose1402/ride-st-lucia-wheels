
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleFormValues } from "../VehicleFormTypes";

const VEHICLE_TYPES = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "jeep", label: "Jeep" },
  { value: "van", label: "Van" },
  { value: "convertible", label: "Convertible" },
  { value: "hatchback", label: "Hatchback" },
];

const VehicleTypeField = () => {
  const { setValue, watch, formState: { errors } } = useFormContext<VehicleFormValues>();
  
  return (
    <div className="space-y-2">
      <Label htmlFor="vehicle_type">Vehicle Type</Label>
      <Select
        onValueChange={(value) => setValue('vehicle_type', value)}
        value={watch('vehicle_type')}
      >
        <SelectTrigger id="vehicle_type">
          <SelectValue placeholder="Select vehicle type" />
        </SelectTrigger>
        <SelectContent>
          {VEHICLE_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.vehicle_type && (
        <p className="text-sm text-red-500">{errors.vehicle_type.message}</p>
      )}
    </div>
  );
};

export default VehicleTypeField;
