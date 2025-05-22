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
          
          if (vehicleData) {
            // Ensure location is properly formatted
            if (vehicleData.location && typeof vehicleData.location === 'object') {
              // Keep the location object as is, it will be handled by the formatLocation function
            } else if (vehicleData.location) {
              // Try to parse if it's a string
              try {
                vehicleData.location = JSON.parse(vehicleData.location);
              } catch (e) {
                // If parsing fails, create a default object
                vehicleData.location = { 
                  street_address: String(vehicleData.location),
                  constituency: ''
                };
              }
            }
            
            setVehicle(vehicleData);
            
            // Make sure we're loading images correctly
            if (vehicleData.vehicle_images && vehicleData.vehicle_images.length > 0) {
              console.log(`Found ${vehicleData.vehicle_images.length} images for vehicle:`, vehicleData.vehicle_images);
              setImages(vehicleData.vehicle_images);
            } else {
              console.log("No images found for vehicle");
              setImages([]);
            }
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
