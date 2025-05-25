
import { useState, useEffect } from 'react';
import { MapPin, Star, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAddressFromLocationData } from '@/utils/locationHelpers';
import CompanyInfoCard from './CompanyInfoCard';
import BookingCard from './BookingCard';
import VehicleSpecifications from './VehicleSpecifications';
import VehicleImageGallery from './VehicleImageGallery';
import { Vehicle, RentalCompany } from '@/types/vehicle';

interface VehicleDetailContentProps {
  vehicle: Vehicle;
  companyData: RentalCompany | null;
}

const VehicleDetailContent = ({ vehicle, companyData }: VehicleDetailContentProps) => {
  console.log('VehicleDetailContent received:', {
    vehicle: vehicle?.id,
    vehicleName: vehicle?.name,
    companyData: companyData?.id,
    companyName: companyData?.company_name,
    hasVehicleImages: vehicle?.vehicle_images?.length || 0
  });

  // Get vehicle type from the joined vehicle_types table or fallback to name analysis
  const getVehicleType = () => {
    if (vehicle.vehicle_types?.name) {
      return vehicle.vehicle_types.name;
    }
    
    if (!vehicle.name) return 'Vehicle';
    
    const name = vehicle.name.toLowerCase();
    if (name.includes('suv') || name.includes('rav4') || name.includes('cr-v')) return 'SUV';
    if (name.includes('jeep') || name.includes('wrangler')) return 'Jeep';
    if (name.includes('van') || name.includes('minivan')) return 'Van';
    if (name.includes('convertible') || name.includes('cabrio')) return 'Convertible';
    if (name.includes('hatchback')) return 'Hatchback';
    if (name.includes('sedan') || name.includes('camry') || name.includes('accord')) return 'Sedan';
    
    if (vehicle.seats >= 7) return 'Van';
    if (vehicle.seats >= 5) return 'SUV';
    return 'Sedan';
  };

  const formatLocationDisplay = (loc: any): string => {
    if (typeof loc === 'string') return loc;
    
    const { street_address, constituency } = getAddressFromLocationData(loc);
    const parts = [];
    if (street_address) parts.push(street_address);
    if (constituency) parts.push(constituency);
    
    return parts.join(', ') || "St. Lucia";
  };

  const getFeaturesList = () => {
    if (!vehicle.features || typeof vehicle.features !== 'object') return [];
    
    const featureMap = {
      air_conditioning: 'Air Conditioning',
      bluetooth: 'Bluetooth',
      gps: 'GPS Navigation',
      usb: 'USB Ports',
      child_seat: 'Child Seat Available',
      backup_camera: 'Backup Camera',
      roof_rack: 'Roof Rack',
      gps_navigation: 'GPS Navigation',
      usb_port: 'USB Port'
    };

    return Object.entries(vehicle.features)
      .filter(([key, value]) => value === true)
      .map(([key]) => featureMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
  };

  const vehicleType = getVehicleType();
  const features = getFeaturesList();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-4">
        <a href="/" className="hover:text-brand-purple">Home</a>
        <span className="mx-2">/</span>
        <a href="/vehicles" className="hover:text-brand-purple">Vehicles</a>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{vehicle.name}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Vehicle details */}
        <div className="lg:col-span-2">
          {/* Vehicle Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-brand-dark">{vehicle.name}</h1>
              <Badge className="bg-brand-purple">{vehicleType}</Badge>
            </div>
            <div className="flex items-center mt-2">
              <MapPin size={16} className="text-gray-500 mr-1" />
              <span className="text-gray-600">{formatLocationDisplay(vehicle.location)}</span>
              
              <div className="flex items-center ml-4">
                <Star size={16} className="text-brand-orange fill-brand-orange mr-1" />
                <span className="font-medium">{vehicle.rating || 4.5}</span>
                <span className="text-gray-500 ml-1">(0 reviews)</span>
              </div>
            </div>
          </div>

          {/* Vehicle Images */}
          <VehicleImageGallery vehicle={vehicle} />

          {/* Vehicle Specifications */}
          <VehicleSpecifications vehicle={vehicle} vehicleType={vehicleType} />

          {/* Vehicle Info Tabs */}
          <Tabs defaultValue="description" className="mb-8">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>About this vehicle</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {vehicle.description || `Experience the beauty of St. Lucia with our ${vehicle.name}. This reliable vehicle offers comfort and convenience for your island adventure.`}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Features</CardTitle>
                </CardHeader>
                <CardContent>
                  {features.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <Check size={16} className="text-brand-purple mr-2" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No specific features listed for this vehicle.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">No reviews yet for this vehicle. Be the first to review!</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right column - Booking and company info */}
        <div>
          {/* Booking Card with all required fields */}
          <BookingCard vehicle={vehicle} />

          {/* Company Information Card */}
          <CompanyInfoCard vehicle={vehicle} companyData={companyData} />
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailContent;
