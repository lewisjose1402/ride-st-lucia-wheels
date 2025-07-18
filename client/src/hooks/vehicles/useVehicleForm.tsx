
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useVehicleData } from './useVehicleData';
import { useVehicleFormSubmit } from './useVehicleFormSubmit';
import { useFormInitialization } from './useFormInitialization';
import { VehicleFormValues, VehicleImage } from '@/components/company/vehicles/VehicleFormTypes';

const vehicleFormSchema = z.object({
  name: z.string().min(1, 'Vehicle name is required'),
  price_per_day: z.string().min(1, 'Price per day is required'),
  street_address: z.string().min(1, 'Street address is required'),
  constituency: z.string().min(1, 'Constituency is required'),
  description: z.string().optional(),
  seats: z.string().min(1, 'Number of seats is required'),
  transmission: z.string().min(1, 'Transmission type is required'),
  vehicle_type: z.string().min(1, 'Vehicle type is required'),
  fuel_type: z.string().min(1, 'Fuel type is required'),
  is_available: z.boolean(),
  features: z.object({
    air_conditioning: z.boolean(),
    bluetooth: z.boolean(),
    gps: z.boolean(),
    usb: z.boolean(),
    child_seat: z.boolean(),
  }),
});

export const useVehicleForm = (id?: string) => {
  const methods = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
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
