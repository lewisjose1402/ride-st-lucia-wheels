
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VehicleFormValues } from "./VehicleFormTypes";

const VehicleDescription = () => {
  const { register } = useFormContext<VehicleFormValues>();
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Description</h3>
      
      <div className="space-y-2">
        <Label htmlFor="description">Vehicle Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your vehicle in detail, including special features and conditions..."
          className="min-h-[150px]"
          {...register('description')}
        />
      </div>
    </div>
  );
};

export default VehicleDescription;
