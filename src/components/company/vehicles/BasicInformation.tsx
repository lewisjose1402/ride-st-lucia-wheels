
import { useFormContext } from "react-hook-form";
import VehicleDetailsFields from "./form/VehicleDetailsFields";
import AddressFields from "./form/AddressFields";
import AvailabilityToggle from "./form/AvailabilityToggle";
import { VehicleFormValues } from "./VehicleFormTypes";

const BasicInformation = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle Details */}
        <VehicleDetailsFields />
        
        {/* Address Fields */}
        <AddressFields />
        
        {/* Availability Toggle */}
        <AvailabilityToggle />
      </div>
    </div>
  );
};

export default BasicInformation;
