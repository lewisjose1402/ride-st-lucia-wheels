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
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingStats, setBookingStats] = useState({
    activeBookings: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Get company directly from rental_companies table with eq instead of maybeSingle
        const { data: companies, error: companyError } = await supabase
          .from('rental_companies')
          .select('*')
          .eq('user_id', user.id);
        
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
        
        // Check if any company was found
        const company = companies && companies.length > 0 ? companies[0] : null;
        
        if (!company) {
          // If no company record exists, we need to create one from user metadata
          const { data: userData } = await supabase.auth.getUser();
          const userMetadata = userData?.user?.user_metadata;
          
          if (userMetadata && userMetadata.company_name) {
            console.log("Creating new company from metadata:", userMetadata);
            // Create a new company record
            try {
              const { data: newCompany, error: insertError } = await supabase
                .from('rental_companies')
                .insert([{
                  user_id: user.id,
                  company_name: userMetadata.company_name,
                  email: userMetadata.email || user.email || '',
                  phone: userMetadata.phone || ''
                }])
                .select();
              
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
              
              if (newCompany && newCompany.length > 0) {
                setCompanyData(newCompany[0]);
                // No vehicles yet for a new company
                setVehicles([]);
              }
            } catch (error) {
              console.error("Unexpected error creating company:", error);
              toast({
                title: "Error setting up company",
                description: "An unexpected error occurred while setting up your company",
                variant: "destructive",
              });
            }
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
            if (company.id) {
              // Fetch vehicles
              const vehiclesData = await getCompanyVehicles(company.id);
              setVehicles(vehiclesData || []);
              
              // Fetch all bookings for this company's vehicles
              if (vehiclesData && vehiclesData.length > 0) {
                // Create an array of vehicle IDs converted to strings
                const vehicleIds = vehiclesData.map(vehicle => String(vehicle.id));
                
                // Use the string array with Supabase
                const { data: bookingsData, error: bookingsError } = await supabase
                  .from('bookings')
                  .select('*')
                  .in('vehicle_id', vehicleIds);
                
                if (bookingsError) {
                  console.error("Error fetching bookings:", bookingsError);
                } else {
                  setBookings(bookingsData || []);
                  
                  // Calculate stats
                  const currentDate = new Date();
                  
                  // Count active bookings (not completed/cancelled and current date is between pickup and dropoff)
                  const active = bookingsData?.filter(booking => 
                    booking.status !== 'completed' && 
                    booking.status !== 'cancelled' &&
                    new Date(booking.pickup_date) <= currentDate &&
                    new Date(booking.dropoff_date) >= currentDate
                  ).length || 0;
                  
                  // Calculate total revenue from completed bookings
                  const revenue = bookingsData?.reduce((total, booking) => {
                    if (booking.status === 'completed') {
                      return total + (parseFloat(booking.total_price) || 0);
                    }
                    return total;
                  }, 0) || 0;
                  
                  setBookingStats({
                    activeBookings: active,
                    totalRevenue: revenue
                  });
                }
              }
            }
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
    vehicles,
    bookings,
    bookingStats
  };
};
