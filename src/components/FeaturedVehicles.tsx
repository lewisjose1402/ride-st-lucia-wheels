
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import VehicleCard from './VehicleCard';

const FeaturedVehicles = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select(`
            *,
            vehicle_images(*),
            rental_companies(company_name)
          `)
          .eq('is_available', true)
          .eq('is_featured', true)
          .limit(4)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching featured vehicles:', error);
          return;
        }

        setVehicles(data || []);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedVehicles();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">
              Featured Vehicles
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our most popular rental options in St. Lucia
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">
            Featured Vehicles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our most popular rental options in St. Lucia
          </p>
        </div>
        
        {vehicles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No featured vehicles available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles.map(vehicle => {
              // Get the primary image or first available image
              const primaryImage = vehicle.vehicle_images?.find(img => img.is_primary);
              const imageUrl = primaryImage?.image_url || vehicle.vehicle_images?.[0]?.image_url || '/placeholder.svg';
              
              return (
                <VehicleCard 
                  key={vehicle.id} 
                  id={vehicle.id}
                  name={vehicle.name}
                  image={imageUrl}
                  type={vehicle.vehicle_type || 'Vehicle'}
                  seats={vehicle.seats}
                  transmission={vehicle.transmission}
                  price={vehicle.price_per_day}
                  rating={vehicle.rating || 4.5}
                  location={vehicle.location}
                  featured={true}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedVehicles;
