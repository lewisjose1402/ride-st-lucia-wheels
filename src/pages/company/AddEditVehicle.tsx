
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useForm, FormProvider } from 'react-hook-form';
import CompanyLayout from '@/components/company/CompanyLayout';
import { Button } from '@/components/ui/button';
import {
  getCompanyProfile,
  getVehicle,
  createVehicle,
  updateVehicle,
} from '@/services/companyService';
import { Car } from 'lucide-react';
import { VehicleFormValues, VehicleImage } from '@/components/company/vehicles/VehicleFormTypes';
import VehicleImageUploader from '@/components/company/vehicles/VehicleImageUploader';
import BasicInformation from '@/components/company/vehicles/BasicInformation';
import VehicleDescription from '@/components/company/vehicles/VehicleDescription';
import VehicleFeatures from '@/components/company/vehicles/VehicleFeatures';

const AddEditVehicle = () => {
  const { id } = useParams<{ id: string }>();
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
  }, [user, id, isEditMode, methods]);

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
      
      let savedVehicle;
      
      if (isEditMode && id) {
        savedVehicle = await updateVehicle(id, vehicleData);
      } else {
        savedVehicle = await createVehicle(vehicleData);
        
        // Add images for new vehicle
        // Images are handled by the VehicleImageUploader component
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

  if (isLoading) {
    return (
      <CompanyLayout title={isEditMode ? "Edit Vehicle" : "Add New Vehicle"}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
        </div>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout title={isEditMode ? "Edit Vehicle" : "Add New Vehicle"}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          {/* Vehicle Images */}
          <VehicleImageUploader 
            images={images} 
            setImages={setImages} 
            vehicleId={id} 
            isEditMode={isEditMode} 
          />

          {/* Basic Information */}
          <BasicInformation />

          {/* Description */}
          <VehicleDescription />

          {/* Features */}
          <VehicleFeatures />

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="bg-brand-purple hover:bg-brand-purple-dark" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Car className="mr-2 h-4 w-4" />
                  {isEditMode ? 'Update Vehicle' : 'Add Vehicle'}
                </>
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/company/vehicles')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </FormProvider>
    </CompanyLayout>
  );
};

export default AddEditVehicle;
