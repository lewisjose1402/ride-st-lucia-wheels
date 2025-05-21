
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { getVehicle, createVehicle, updateVehicle } from '@/services/vehicleService';
import { getCompanyProfile } from '@/services/companyProfileService';
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

  const methods = useForm<VehicleFormValues>({
    defaultValues: {
      name: '',
      price_per_day: '',
      location: '',
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
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const companyProfile = await getCompanyProfile(user.id);
        setCompanyData(companyProfile);
        
        if (isEditMode && id) {
          const vehicleData = await getVehicle(id);
          setVehicle(vehicleData);
          setImages(vehicleData.vehicle_images || []);
          
          // Set form values
          methods.setValue('name', vehicleData.name);
          methods.setValue('price_per_day', vehicleData.price_per_day.toString());
          methods.setValue('location', vehicleData.location);
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
        toast({
          title: isEditMode ? "Error loading vehicle" : "Error initializing form",
          description: "Something went wrong",
          variant: "destructive",
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeForm();
  }, [user, id, isEditMode, methods, toast]);

  const onSubmit = async (data: VehicleFormValues) => {
    if (!companyData) return;
    
    try {
      setIsSubmitting(true);
      
      const vehicleData = {
        ...data,
        company_id: companyData.id,
        price_per_day: parseFloat(data.price_per_day),
        seats: parseInt(data.seats),
        features: data.features
      };
      
      if (isEditMode && id) {
        await updateVehicle(id, vehicleData);
      } else {
        await createVehicle(vehicleData);
      }
      
      toast({
        title: isEditMode ? "Vehicle updated" : "Vehicle created",
        description: isEditMode ? "Vehicle has been updated successfully" : "Vehicle has been added successfully",
      });
      
      navigate('/company/vehicles');
    } catch (error) {
      toast({
        title: isEditMode ? "Error updating vehicle" : "Error creating vehicle",
        description: "Something went wrong",
        variant: "destructive",
      });
      console.error(error);
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
