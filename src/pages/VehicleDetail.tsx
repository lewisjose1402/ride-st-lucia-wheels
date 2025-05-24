
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import VehicleDetailContent from '@/components/vehicle-detail/VehicleDetailContent';

const VehicleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [companyData, setCompanyData] = useState(null);

  const { data: vehicleData, isLoading, error } = useQuery({
    queryKey: ['vehicle-with-images', id],
    queryFn: async () => {
      if (!id) throw new Error('Vehicle ID is required');
      
      console.log('Fetching vehicle data for ID:', id);
      
      // Fetch vehicle with images only
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .select(`
          *,
          vehicle_images(*)
        `)
        .eq('id', id)
        .single();

      if (vehicleError) {
        console.error('Error fetching vehicle:', vehicleError);
        throw new Error(vehicleError.message);
      }

      console.log('Fetched vehicle data:', vehicle);
      return vehicle;
    },
    enabled: !!id,
  });

  useEffect(() => {
    const fetchCompany = async () => {
      if (!vehicleData?.company_id) return;

      console.log('Fetching company data for company_id:', vehicleData.company_id);

      const { data, error } = await supabase
        .from('rental_companies')
        .select('*')
        .eq('id', vehicleData.company_id)
        .single();

      if (!error) {
        console.log('Fetched company data:', data);
        setCompanyData(data);
      } else {
        console.error("Error fetching company:", error);
      }
    };

    fetchCompany();
  }, [vehicleData]);

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
        <VehicleDetailContent 
          vehicle={vehicleData} 
          companyData={companyData} 
        />
      </main>
      <Footer />
    </div>
  );
};

export default VehicleDetail;
