
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { VehicleFormValues } from "../VehicleFormTypes";

interface FeatureCheckboxProps {
  id: string;
  label: string;
}

const FeatureCheckbox: React.FC<FeatureCheckboxProps> = ({ id, label }) => {
  const { watch, setValue } = useFormContext<VehicleFormValues>();
  const isChecked = watch(`features.${id.split('.')[1]}`);
  
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={isChecked}
        onCheckedChange={(checked) => 
          setValue(`features.${id.split('.')[1]}`, checked as boolean)}
      />
      <Label htmlFor={id} className="font-normal">{label}</Label>
    </div>
  );
};

export default FeatureCheckbox;
