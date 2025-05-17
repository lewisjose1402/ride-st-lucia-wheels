
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleFormValues } from "./VehicleFormTypes";

const BasicInformation = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext<VehicleFormValues>();
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g. Castries, St. Lucia"
            {...register('location', { required: 'Location is required' })}
          />
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="seats">Number of Seats</Label>
          <Select
            onValueChange={(value) => setValue('seats', value)}
            defaultValue={watch('seats')}
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
            defaultValue={watch('transmission')}
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
      </div>
    </div>
  );
};

export default BasicInformation;
