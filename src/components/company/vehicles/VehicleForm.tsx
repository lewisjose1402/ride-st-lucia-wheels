
import React from 'react';
import { FormProvider } from 'react-hook-form';
import VehicleImageUploader from './VehicleImageUploader';
import BasicInformation from './BasicInformation';
import VehicleDescription from './VehicleDescription';
import VehicleFeatures from './VehicleFeatures';
import VehicleFormActions from './VehicleFormActions';
import { VehicleImage } from './VehicleFormTypes';

interface VehicleFormProps {
  methods: any;
  onSubmit: (data: any) => Promise<void>;
  images: VehicleImage[];
  setImages: React.Dispatch<React.SetStateAction<VehicleImage[]>>;
  vehicleId?: string;
  isEditMode: boolean;
  isSubmitting: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  methods,
  onSubmit,
  images,
  setImages,
  vehicleId,
  isEditMode,
  isSubmitting
}) => {
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        {/* Vehicle Images */}
        <VehicleImageUploader 
          images={images} 
          setImages={setImages} 
          vehicleId={vehicleId} 
          isEditMode={isEditMode} 
        />

        {/* Basic Information */}
        <BasicInformation />

        {/* Description */}
        <VehicleDescription />

        {/* Features */}
        <VehicleFeatures />

        {/* Submit Buttons */}
        <VehicleFormActions 
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
        />
      </form>
    </FormProvider>
  );
};

export default VehicleForm;
