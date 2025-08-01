
import { useState, useEffect } from 'react';
import VehicleCard from './VehicleCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const FeaturedVehicles = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        console.log('Fetching featured vehicles from backend API...');
        
        // First try to get featured vehicles from backend API (which handles company filtering)
        const featuredResponse = await fetch('/api/vehicles/featured');
        if (!featuredResponse.ok) {
          throw new Error('Failed to fetch featured vehicles from API');
        }
        
        const featuredData = await featuredResponse.json();
        console.log('Featured vehicles from API:', featuredData);

        // If no featured vehicles, get any available vehicles from API
        if (!featuredData || featuredData.length === 0) {
          console.log('No featured vehicles found, fetching any available vehicles from API...');
          
          const allResponse = await fetch('/api/vehicles');
          if (!allResponse.ok) {
            throw new Error('Failed to fetch vehicles from API');
          }
          
          const allData = await allResponse.json();
          console.log('All vehicles from API:', allData);
          
          // Take first 4 vehicles
          setVehicles((allData || []).slice(0, 4));
        } else {
          setVehicles(featuredData);
        }
      } catch (error) {
        console.error('Error fetching vehicles from API:', error);
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
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {[...Array(4)].map((_, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="bg-white rounded-lg shadow-md animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
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
            <p className="text-gray-600 text-lg">No vehicles available at the moment.</p>
            <p className="text-gray-500 text-sm mt-2">Please check back later or contact us for more information.</p>
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {vehicles.map(vehicle => {
                console.log('Rendering vehicle:', vehicle);
                
                // Get the primary image or first available image
                const primaryImage = vehicle.vehicle_images?.find(img => img.is_primary);
                const imageUrl = primaryImage?.image_url || vehicle.vehicle_images?.[0]?.image_url || '/placeholder.svg';
                
                // Check if vehicle has required fields
                if (!vehicle.name || !vehicle.price_per_day) {
                  console.warn('Vehicle missing required fields:', vehicle);
                  return null;
                }
                
                return (
                  <CarouselItem key={vehicle.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <VehicleCard 
                      id={vehicle.id}
                      name={vehicle.name}
                      image={imageUrl}
                      type={vehicle.vehicle_type || 'Vehicle'}
                      seats={vehicle.seats || 4}
                      transmission={vehicle.transmission || 'Manual'}
                      price={vehicle.price_per_day}
                      rating={vehicle.rating || 4.5}
                      location={vehicle.location || 'St. Lucia'}
                      featured={vehicle.is_featured || false}
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default FeaturedVehicles;
