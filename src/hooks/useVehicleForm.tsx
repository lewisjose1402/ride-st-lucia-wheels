
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { getVehicle, createVehicle, updateVehicle } from '@/services/vehicleService';
import { getCompanyProfile } from '@/services/companyProfileService';
import { addVehicleImage } from '@/services/vehicleImageService';
import { VehicleFormValues, VehicleImage } from '@/components/company/vehicles/VehicleFormTypes';

export const useVehicleForm = (id?: string) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [vehicle, setVehicle] = useState<any>(null);
  const [images, setImages] = useState<VehicleImage[]>([]);
  
  const isEditMode = !!id;

  function getAddressFromLocationData(location: any): { street_address: string, constituency: string } {
    if (!location) return { street_address: '', constituency: '' };
    
    try {
      // If location is already a JSON object
      if (typeof location === 'object') {
        return {
          street_address: location.street_address || '',
          constituency: location.constituency || ''
        };
      }
      
      // If location is a JSON string
      const parsedLocation = JSON.parse(location);
      return {
        street_address: parsedLocation.street_address || '',
        constituency: parsedLocation.constituency || ''
      };
    } catch (e) {
      // If location is just a string or invalid JSON
      return {
        street_address: String(location),
        constituency: ''
      };
    }
  }

  const methods = useForm<VehicleFormValues>({
    defaultValues: {
      name: '',
      price_per_day: '',
      street_address: '',
      constituency: '',
      description: '',
      seats: '',
      transmission: 'automatic',
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

  useEffect(() => {
    const initializeForm = async () => {
      if (!user) {
        console.log("No authenticated user found");
        toast({
          title: "Authentication required",
          description: "You need to be signed in to access this page",
          variant: "destructive",
        });
        navigate('/signin');
        return;
      }
      
      try {
        setIsLoading(true);
        console.log("Initializing vehicle form for user:", user.id);
        
        const companyProfile = await getCompanyProfile(user.id);
        console.log("Retrieved company profile:", companyProfile);
        
        if (!companyProfile) {
          toast({
            title: "Company profile not found",
            description: "Please complete your company profile first",
            variant: "destructive",
          });
          navigate('/company/profile');
          return;
        }
        
        setCompanyData(companyProfile);
        
        if (isEditMode && id) {
          console.log("Edit mode enabled, fetching vehicle:", id);
          const vehicleData = await getVehicle(id);
          console.log("Retrieved vehicle data:", vehicleData);
          
          setVehicle(vehicleData);
          setImages(vehicleData.vehicle_images || []);
          
          // Get address data
          const { street_address, constituency } = getAddressFromLocationData(vehicleData.location);
          
          // Set form values
          methods.setValue('name', vehicleData.name);
          methods.setValue('price_per_day', vehicleData.price_per_day.toString());
          methods.setValue('street_address', street_address);
          methods.setValue('constituency', constituency);
          methods.setValue('description', vehicleData.description || '');
          methods.setValue('seats', vehicleData.seats.toString());
          methods.setValue('transmission', vehicleData.transmission);
          methods.setValue('is_available', vehicleData.is_available);
          
          // Set features
          if (vehicleData.features) {
            Object.keys(vehicleData.features).forEach((feature) => {
              const featureKey = feature as keyof VehicleFormValues['features'];
              methods.setValue(`features.${featureKey}`, vehicleData.features[feature]);
            });
          }
        }
      } catch (error) {
        console.error("Error in initialization:", error);
        toast({
          title: isEditMode ? "Error loading vehicle" : "Error initializing form",
          description: "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeForm();
  }, [user, id, isEditMode, methods, toast, navigate]);

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
    methods,
    isLoading,
    isSubmitting,
    vehicle,
    images,
    setImages,
    onSubmit,
    isEditMode
  };
};
