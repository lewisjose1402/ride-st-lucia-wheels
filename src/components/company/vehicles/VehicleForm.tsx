import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VehicleImageUploader from './image-uploader/VehicleImageUploader';
import BasicInformation from './BasicInformation';
import VehicleDescription from './VehicleDescription';
import VehicleFeatures from './VehicleFeatures';
import VehicleCalendar from './VehicleCalendar';
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
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Vehicle Details</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            {isEditMode && vehicleId && (
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details" className="space-y-8 pt-4">
            {/* Basic Information */}
            <BasicInformation />

            {/* Description */}
            <VehicleDescription />

            {/* Features */}
            <VehicleFeatures />
          </TabsContent>

          <TabsContent value="photos" className="pt-4">
            {/* Vehicle Images */}
            <VehicleImageUploader 
              images={images} 
              setImages={setImages} 
              vehicleId={vehicleId} 
              isEditMode={isEditMode} 
            />
          </TabsContent>

          {isEditMode && vehicleId && (
            <TabsContent value="calendar" className="pt-4">
              <VehicleCalendar vehicleId={vehicleId} />
            </TabsContent>
          )}
        </Tabs>

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
