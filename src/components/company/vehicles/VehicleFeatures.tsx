
import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { VehicleFormValues } from "./VehicleFormTypes";

const VehicleFeatures = () => {
  const { watch, setValue } = useFormContext<VehicleFormValues>();
  const features = watch('features');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Features</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="features.air_conditioning"
            checked={features.air_conditioning}
            onCheckedChange={(checked) => 
              setValue('features.air_conditioning', checked as boolean)}
          />
          <Label htmlFor="features.air_conditioning" className="font-normal">Air Conditioning</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="features.bluetooth"
            checked={features.bluetooth}
            onCheckedChange={(checked) => 
              setValue('features.bluetooth', checked as boolean)}
          />
          <Label htmlFor="features.bluetooth" className="font-normal">Bluetooth</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="features.gps"
            checked={features.gps}
            onCheckedChange={(checked) => 
              setValue('features.gps', checked as boolean)}
          />
          <Label htmlFor="features.gps" className="font-normal">GPS Navigation</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="features.usb"
            checked={features.usb}
            onCheckedChange={(checked) => 
              setValue('features.usb', checked as boolean)}
          />
          <Label htmlFor="features.usb" className="font-normal">USB Port</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="features.child_seat"
            checked={features.child_seat}
            onCheckedChange={(checked) => 
              setValue('features.child_seat', checked as boolean)}
          />
          <Label htmlFor="features.child_seat" className="font-normal">Child Seat Compatible</Label>
        </div>
      </div>
    </div>
  );
};

export default VehicleFeatures;
