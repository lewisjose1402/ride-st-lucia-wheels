
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { createVehicle, updateVehicle } from '@/services/vehicleService';
import { addVehicleImage } from '@/services/vehicleImageService';
import { VehicleFormValues, VehicleImage } from '@/components/company/vehicles/VehicleFormTypes';

interface UseVehicleFormSubmitProps {
  isEditMode: boolean;
  companyData: any;
  images: VehicleImage[];
  id?: string;
}

export const useVehicleFormSubmit = ({ isEditMode, companyData, images, id }: UseVehicleFormSubmitProps) => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: VehicleFormValues) => {
    if (!companyData) {
      console.error("No company data available");
      toast({
        title: "Company profile missing",
        description: "Please complete your company profile first",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      console.error("User authentication required");
      toast({
        title: "Authentication required",
        description: "You need to be signed in to create a vehicle",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("Submitting vehicle form with data:", data);
      console.log("Company data:", companyData);
      
      // Format location as JSON structure
      const locationData = {
        street_address: data.street_address,
        constituency: data.constituency
      };
      
      console.log("Formatted location data:", locationData);
      
      const vehicleData = {
        ...data,
        company_id: companyData.id,
        price_per_day: parseFloat(data.price_per_day),
        seats: parseInt(data.seats),
        features: data.features,
        location: locationData
      };
      
      // Remove the individual address fields since they're now in the location object
      delete (vehicleData as any).street_address;
      delete (vehicleData as any).constituency;
      
      // Remove vehicle_type from the data object as it's not a column in the database
      delete (vehicleData as any).vehicle_type;
      
      console.log("Final vehicle data to submit:", vehicleData);
      
      let vehicleId;
      
      try {
        if (isEditMode && id) {
          console.log("Updating existing vehicle:", id);
          await updateVehicle(id, vehicleData);
          vehicleId = id;
        } else {
          console.log("Creating new vehicle");
          // Create the vehicle first
          const newVehicle = await createVehicle(vehicleData);
          console.log("New vehicle created:", newVehicle);
          vehicleId = newVehicle.id;
          
          // Then add the images
          if (images.length > 0) {
            console.log(`Adding ${images.length} images to new vehicle:`, vehicleId);
            for (let i = 0; i < images.length; i++) {
              try {
                console.log(`Adding image ${i+1}/${images.length}:`, images[i].image_url);
                await addVehicleImage(vehicleId, images[i].image_url, images[i].is_primary);
              } catch (imageError) {
                console.error(`Error adding image ${i+1}:`, imageError);
                toast({
                  title: `Error adding image ${i+1}`,
                  description: imageError instanceof Error ? imageError.message : "Failed to associate image with vehicle",
                  variant: "destructive",
                });
                // Continue with other images even if one fails
              }
            }
          }
        }
        
        toast({
          title: isEditMode ? "Vehicle updated" : "Vehicle created",
          description: isEditMode ? "Vehicle has been updated successfully" : "Vehicle has been added successfully",
        });
        
        navigate('/company/vehicles');
      } catch (vehicleError) {
        console.error("Error with vehicle operation:", vehicleError);
        throw vehicleError;
      }
    } catch (error) {
      console.error("Error submitting vehicle form:", error);
      toast({
        title: isEditMode ? "Error updating vehicle" : "Error creating vehicle",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    onSubmit
  };
};
