import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { getVehicle } from '@/services/vehicleService';
import { getCompanyProfile } from '@/services/companyProfileService';
import { VehicleImage } from '@/components/company/vehicles/VehicleFormTypes';

export const useVehicleData = (id?: string) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [vehicle, setVehicle] = useState<any>(null);
  const [images, setImages] = useState<VehicleImage[]>([]);
  
  const isEditMode = !!id;

  useEffect(() => {
    const initializeData = async () => {
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
        console.log("Initializing vehicle data for user:", user.id);
        
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
    
    initializeData();
  }, [user, id, isEditMode, toast, navigate]);

  return {
    isLoading,
    companyData,
    vehicle,
    images,
    setImages,
    isEditMode
  };
};
