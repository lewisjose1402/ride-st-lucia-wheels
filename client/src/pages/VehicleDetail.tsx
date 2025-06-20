
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import VehicleDetailContent from '@/components/vehicle-detail/VehicleDetailContent';
import { Vehicle } from '@/types/vehicle';

const VehicleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Single optimized query to fetch vehicle with company data, images, and type
  const { data: vehicleData, isLoading, error } = useQuery({
    queryKey: ['vehicle-with-company-detail', id],
    queryFn: async () => {
      if (!id) throw new Error('Vehicle ID is required');
      
      console.log('Fetching vehicle and company data for ID:', id);
      
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .select(`
          *,
          vehicle_images(*),
          vehicle_types(name),
          rental_companies(*)
        `)
        .eq('id', id)
        .single();

      if (vehicleError) {
        console.error('Error fetching vehicle with company data:', vehicleError);
        throw new Error(vehicleError.message);
      }

      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      console.log('Successfully fetched vehicle with company data:', vehicle);
      
      // Type cast the vehicle data to match our Vehicle interface
      return vehicle as Vehicle;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 pb-12 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="h-64 bg-gray-200 rounded mb-4"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
                <div>
                  <div className="h-48 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !vehicleData) {
    console.error('Vehicle detail page error:', error);
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 pb-12 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Vehicle Not Found</h1>
              <p className="text-gray-600 mb-4">
                {error?.message || 'The vehicle you\'re looking for doesn\'t exist or is no longer available.'}
              </p>
              <Button onClick={() => setLocation('/vehicles')} className="bg-brand-purple hover:bg-brand-purple-dark">
                Browse All Vehicles
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Extract company data from the joined result
  const companyData = vehicleData.rental_companies;
  
  console.log('Rendering VehicleDetail with data:', {
    vehicle: vehicleData,
    company: companyData
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 pb-12 bg-gray-50">
        <ErrorBoundary>
          <VehicleDetailContent 
            vehicle={vehicleData} 
            companyData={companyData} 
          />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default VehicleDetail;
