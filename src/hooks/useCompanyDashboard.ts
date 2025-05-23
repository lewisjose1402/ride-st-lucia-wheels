
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getCompanyVehicles } from '@/services/companyService';
import { supabase } from '@/integrations/supabase/client';

// Define proper types for our data structures
interface Company {
  id: string;
  user_id: string;
  company_name: string;
  email: string;
  phone: string;
  address?: string;
  description?: string;
  logo_url?: string;
  created_at?: string;
  updated_at?: string;
  is_approved?: boolean;
}

interface Vehicle {
  id: string;
  name: string;
  company_id: string;
  price_per_day: number;
  seats: number;
  transmission: string;
  description?: string;
  is_available?: boolean;
  feed_token?: string;
  vehicle_images?: VehicleImage[];
  [key: string]: any; // For other properties that might be present
}

interface VehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  is_primary?: boolean;
}

interface Booking {
  id: string;
  vehicle_id: string;
  user_id: string;
  pickup_date: string;
  dropoff_date: string;
  status: string;
  total_price: number;
  [key: string]: any; // For other properties
}

interface BookingStats {
  activeBookings: number;
  totalRevenue: number;
}

interface CompanyDashboardResult {
  isLoading: boolean;
  companyData: Company | null;
  vehicles: Vehicle[];
  bookings: Booking[];
  bookingStats: BookingStats;
}

/**
 * Hook to fetch and manage company dashboard data
 */
export const useCompanyDashboard = (): CompanyDashboardResult => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingStats, setBookingStats] = useState<BookingStats>({
    activeBookings: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, [user, toast]);

  /**
   * Main function to load all dashboard data
   */
  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Step 1: Fetch company data or create if needed
      const company = await fetchCompanyData(user.id);
      if (!company) {
        setIsLoading(false);
        return;
      }
      
      // Step 2: Load vehicles for this company
      const vehiclesData = await fetchVehiclesData(company.id);
      setVehicles(vehiclesData || []);
      
      // Step 3: Fetch bookings for these vehicles
      if (vehiclesData && vehiclesData.length > 0) {
        await fetchBookingsData(vehiclesData);
      }
      
    } catch (error) {
      console.error("Unexpected error in dashboard data loading:", error);
      toast({
        title: "Error loading dashboard",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch company data by user ID
   */
  const fetchCompanyData = async (userId: string): Promise<Company | null> => {
    try {
      // Get company directly from rental_companies table
      const { data: companies, error: companyError } = await supabase
        .from('rental_companies')
        .select('*')
        .eq('user_id', userId);
      
      if (companyError) {
        console.error("Error fetching company:", companyError);
        toast({
          title: "Error loading dashboard",
          description: "Failed to load your company data. Please try again later.",
          variant: "destructive",
        });
        return null;
      }
      
      // Check if any company was found
      const company = companies && companies.length > 0 ? companies[0] : null;
      
      if (!company) {
        // If no company record exists, create one from user metadata
        return await createCompanyFromMetadata(userId);
      }
      
      // Company found, set it and return
      setCompanyData(company as Company);
      return company as Company;
      
    } catch (error) {
      console.error("Error in fetchCompanyData:", error);
      toast({
        title: "Error loading company data",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    }
  };

  /**
   * Create a new company from user metadata if needed
   */
  const createCompanyFromMetadata = async (userId: string): Promise<Company | null> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userMetadata = userData?.user?.user_metadata;
      
      if (userMetadata && userMetadata.company_name) {
        console.log("Creating new company from metadata:", userMetadata);
        
        // Create a new company record
        const { data: newCompany, error: insertError } = await supabase
          .from('rental_companies')
          .insert([{
            user_id: userId,
            company_name: userMetadata.company_name,
            email: userMetadata.email || userData?.user?.email || '',
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
          return null;
        }
        
        if (newCompany && newCompany.length > 0) {
          setCompanyData(newCompany[0] as Company);
          return newCompany[0] as Company;
        }
      } else {
        toast({
          title: "Company profile missing",
          description: "Please complete your company profile",
          variant: "destructive",
        });
      }
      return null;
    } catch (error) {
      console.error("Error in createCompanyFromMetadata:", error);
      toast({
        title: "Error setting up company",
        description: "An unexpected error occurred while setting up your company",
        variant: "destructive",
      });
      return null;
    }
  };

  /**
   * Fetch vehicles data for a company
   */
  const fetchVehiclesData = async (companyId: string): Promise<Vehicle[]> => {
    try {
      // Always pass companyId as a string to getCompanyVehicles
      const vehiclesData = await getCompanyVehicles(companyId);
      return vehiclesData || [];
    } catch (error) {
      console.error("Error loading vehicles:", error);
      toast({
        title: "Error loading vehicles",
        description: "Failed to load your vehicles",
        variant: "destructive",
      });
      return [];
    }
  };

  /**
   * Fetch bookings for a set of vehicles
   */
  const fetchBookingsData = async (vehiclesData: Vehicle[]): Promise<void> => {
    try {
      // Create an array of vehicle IDs, explicitly as strings
      const vehicleIdStrings: string[] = vehiclesData.map((vehicle) => {
        // Ensure each ID is a string, even if it comes as a number or UUID object
        return String(vehicle.id);
      });
      
      // Use the array of strings with Supabase query
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .in('vehicle_id', vehicleIdStrings);
      
      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError);
        return;
      }
      
      // Set bookings data
      setBookings(bookingsData || []);
      
      // Calculate booking statistics
      calculateBookingStats(bookingsData || []);
      
    } catch (error) {
      console.error("Error in fetchBookingsData:", error);
    }
  };

  /**
   * Calculate booking statistics
   */
  const calculateBookingStats = (bookingsData: Booking[]): void => {
    const currentDate = new Date();
    
    // Count active bookings (not completed/cancelled and current date is between pickup and dropoff)
    const active = bookingsData.filter(booking => 
      booking.status !== 'completed' && 
      booking.status !== 'cancelled' &&
      new Date(booking.pickup_date) <= currentDate &&
      new Date(booking.dropoff_date) >= currentDate
    ).length;
    
    // Calculate total revenue from completed bookings
    const revenue = bookingsData.reduce((total, booking) => {
      if (booking.status === 'completed') {
        // Ensure we're working with numbers for the calculation
        const bookingPrice = typeof booking.total_price === 'string' 
          ? parseFloat(booking.total_price) 
          : Number(booking.total_price) || 0;
        return total + bookingPrice;
      }
      return total;
    }, 0);
    
    setBookingStats({
      activeBookings: active,
      totalRevenue: revenue
    });
  };

  // Return the data and state
  return {
    isLoading,
    companyData,
    vehicles,
    bookings,
    bookingStats
  };
};
