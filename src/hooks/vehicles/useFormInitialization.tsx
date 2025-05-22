
import { useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { getAddressFromLocationData } from '@/utils/locationHelpers';
import { VehicleFormValues } from '@/components/company/vehicles/VehicleFormTypes';

interface UseFormInitializationProps {
  setValue: UseFormSetValue<VehicleFormValues>;
  isEditMode: boolean;
  vehicle: any;
}

export const useFormInitialization = ({ setValue, isEditMode, vehicle }: UseFormInitializationProps) => {
  useEffect(() => {
    if (isEditMode && vehicle) {
      // Get address data
      const { street_address, constituency } = getAddressFromLocationData(vehicle.location);
      
      // Set form values
      setValue('name', vehicle.name);
      setValue('price_per_day', vehicle.price_per_day.toString());
      setValue('street_address', street_address);
      setValue('constituency', constituency);
      setValue('description', vehicle.description || '');
      setValue('seats', vehicle.seats.toString());
      setValue('transmission', vehicle.transmission);
      setValue('vehicle_type', vehicle.vehicle_type || '');
      setValue('is_available', vehicle.is_available);
      
      // Set features
      if (vehicle.features) {
        Object.keys(vehicle.features).forEach((feature) => {
          const featureKey = feature as keyof VehicleFormValues['features'];
          setValue(`features.${featureKey}`, vehicle.features[feature]);
        });
      }
    }
  }, [setValue, isEditMode, vehicle]);
};
