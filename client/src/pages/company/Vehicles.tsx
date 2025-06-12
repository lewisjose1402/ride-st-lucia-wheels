
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import CompanyLayout from '@/components/company/CompanyLayout';
import { getCompanyVehicles, getCompanyProfile } from '@/services/companyService';
import VehiclesHeader from '@/components/company/vehicles/VehiclesHeader';
import VehicleListing from '@/components/company/vehicles/VehicleListing';

const CompanyVehicles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    const loadVehicles = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const companyProfile = await getCompanyProfile(user.id);
        
        if (!companyProfile) {
          toast({
            title: "Company profile missing",
            description: "Please complete your company profile first",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        setCompanyData(companyProfile);
        
        if (companyProfile.id) {
          try {
            const vehiclesData = await getCompanyVehicles(companyProfile.id);
            setVehicles(vehiclesData || []);
          } catch (vehicleError) {
            console.error("Error loading vehicles:", vehicleError);
            toast({
              title: "Error loading vehicles",
              description: "Failed to load your vehicles",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error loading company data:", error);
        toast({
          title: "Error loading data",
          description: "Failed to load your company data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVehicles();
  }, [user, toast]);

  return (
    <CompanyLayout title="Manage Vehicles">
      <VehiclesHeader />
      <VehicleListing 
        vehicles={vehicles} 
        setVehicles={setVehicles} 
        isLoading={isLoading} 
      />
    </CompanyLayout>
  );
};

export default CompanyVehicles;
