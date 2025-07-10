
import { useForm } from 'react-hook-form';
import { useVehicleData } from './useVehicleData';
import { useVehicleFormSubmit } from './useVehicleFormSubmit';
import { useFormInitialization } from './useFormInitialization';
import { VehicleFormValues, VehicleImage } from '@/components/company/vehicles/VehicleFormTypes';

export const useVehicleForm = (id?: string) => {
  const methods = useForm<VehicleFormValues>({
    defaultValues: {
      name: '',
      price_per_day: '',
      street_address: '',
      constituency: '',
      description: '',
      seats: '',
      transmission: '',
      vehicle_type: '',
      fuel_type: '',
      is_available: true,
      features: {
        air_conditioning: false,
        bluetooth: false,
        gps: false,
        usb: false,
        child_seat: false
      }
    }
  });

  const {
    isLoading,
    companyData,
    vehicle,
    images,
    setImages,
    isEditMode
  } = useVehicleData(id);

  // Initialize form with vehicle data when in edit mode
  useFormInitialization({
    setValue: methods.setValue,
    isEditMode,
    vehicle
  });

  // Handle form submission
  const { isSubmitting, onSubmit } = useVehicleFormSubmit({
    isEditMode,
    companyData,
    images,
    id,
    reset: methods.reset,
    setImages
  });

  return {
    methods,
    isLoading,
    isSubmitting,
    images,
    setImages,
    onSubmit,
    isEditMode
  };
};
