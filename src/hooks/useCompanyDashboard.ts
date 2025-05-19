
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { getCompanyVehicles } from '@/services/companyService';
import { supabase } from '@/integrations/supabase/client';

export const useCompanyDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Get company directly from rental_companies table
        const { data: company, error: companyError } = await supabase
          .from('rental_companies')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (companyError) {
          console.error("Error fetching company:", companyError);
          toast({
            title: "Error loading dashboard",
            description: "Failed to load your company data. Please try again later.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        if (!company) {
          // If no company record exists, we need to create one from user metadata
          const { data: userData } = await supabase.auth.getUser();
          const userMetadata = userData?.user?.user_metadata;
          
          if (userMetadata && userMetadata.company_name) {
            // Create a new company record
            const { data: newCompany, error: insertError } = await supabase
              .from('rental_companies')
              .insert([{
                user_id: user.id,
                company_name: userMetadata.company_name,
                email: user.email || '',
                phone: userMetadata.phone || ''
              }])
              .select()
              .single();
            
            if (insertError) {
              console.error("Error creating company:", insertError);
              toast({
                title: "Error setting up company",
                description: "Failed to set up your company profile",
                variant: "destructive",
              });
              setIsLoading(false);
              return;
            }
            
            setCompanyData(newCompany);
            // No vehicles yet for a new company
            setVehicles([]);
          } else {
            toast({
              title: "Company profile missing",
              description: "Please complete your company profile",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
        } else {
          // We have a company, set it and load vehicles
          setCompanyData(company);
          
          try {
            const vehiclesData = await getCompanyVehicles(company.id);
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
        console.error("Unexpected error:", error);
        toast({
          title: "Error loading dashboard",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user, toast]);

  return {
    isLoading,
    companyData,
    vehicles
  };
};
