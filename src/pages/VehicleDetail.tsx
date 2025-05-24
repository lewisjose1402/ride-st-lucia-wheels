
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { getVehicle } from '@/services/vehicleService';
import { supabase } from '@/integrations/supabase/client';
import VehicleDetailContent from '@/components/vehicle-detail/VehicleDetailContent';

const VehicleDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => getVehicle(id!),
    enabled: !!id,
  });

  // Fetch company data for the vehicle
  const { data: companyData } = useQuery({
    queryKey: ['company', vehicle?.company_id],
    queryFn: async () => {
      if (!vehicle?.company_id) {
        console.log('No company_id found for vehicle:', vehicle);
        return null;
      }
      
      console.log('Fetching company data for company_id:', vehicle.company_id);
      
      const { data, error } = await supabase
        .from('rental_companies')
        .select('*')
        .eq('id', vehicle.company_id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching company:', error);
        return null;
      }
      
      console.log('Company data fetched successfully:', data);
      return data;
    },
    enabled: !!vehicle?.company_id,
  });

  // Add debugging logs
  console.log('Vehicle data:', vehicle);
  console.log('Company data in VehicleDetail:', companyData);

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

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 pb-12 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Vehicle Not Found</h1>
              <p className="text-gray-600 mb-4">The vehicle you're looking for doesn't exist or is no longer available.</p>
              <Button onClick={() => navigate('/vehicles')} className="bg-brand-purple hover:bg-brand-purple-dark">
                Browse All Vehicles
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 pb-12 bg-gray-50">
        <VehicleDetailContent vehicle={vehicle} companyData={companyData} />
      </main>
      <Footer />
    </div>
  );
};

export default VehicleDetailPage;
