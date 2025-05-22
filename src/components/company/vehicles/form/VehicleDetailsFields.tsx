
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleFormValues } from "../VehicleFormTypes";
import VehicleTypeField from "./VehicleTypeField";

const VehicleDetailsFields = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext<VehicleFormValues>();
  
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Vehicle Name</Label>
        <Input
          id="name"
          placeholder="e.g. Toyota Camry 2022"
          {...register('name', { required: 'Vehicle name is required' })}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price_per_day">Price Per Day ($)</Label>
        <Input
          id="price_per_day"
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 59.99"
          {...register('price_per_day', { required: 'Price per day is required' })}
        />
        {errors.price_per_day && (
          <p className="text-sm text-red-500">{errors.price_per_day.message}</p>
        )}
      </div>
      
      {/* Vehicle Type field */}
      <VehicleTypeField />
      
      <div className="space-y-2">
        <Label htmlFor="seats">Number of Seats</Label>
        <Select
          onValueChange={(value) => setValue('seats', value)}
          value={watch('seats')}
        >
          <SelectTrigger id="seats">
            <SelectValue placeholder="Select number of seats" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 seats</SelectItem>
            <SelectItem value="4">4 seats</SelectItem>
            <SelectItem value="5">5 seats</SelectItem>
            <SelectItem value="7">7 seats</SelectItem>
            <SelectItem value="9">9+ seats</SelectItem>
          </SelectContent>
        </Select>
        {errors.seats && (
          <p className="text-sm text-red-500">{errors.seats.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="transmission">Transmission</Label>
        <Select
          onValueChange={(value) => setValue('transmission', value)}
          value={watch('transmission')}
        >
          <SelectTrigger id="transmission">
            <SelectValue placeholder="Select transmission type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="automatic">Automatic</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
        {errors.transmission && (
          <p className="text-sm text-red-500">{errors.transmission.message}</p>
        )}
      </div>
    </>
  );
};

export default VehicleDetailsFields;
