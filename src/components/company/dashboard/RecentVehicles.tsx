
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';
import { getAddressFromLocationData } from '@/utils/locationHelpers';
import { Vehicle } from '@/hooks/useCompanyDashboard';

type RecentVehiclesProps = {
  vehicles: Vehicle[];
};

const RecentVehicles = ({ vehicles }: RecentVehiclesProps) => {
  // Format location for display
  const formatLocation = (location: any): string => {
    if (!location) return "N/A";
    
    const { street_address, constituency } = getAddressFromLocationData(location);
    const parts = [];
    if (street_address) parts.push(street_address);
    if (constituency) parts.push(constituency);
    
    return parts.join(', ') || "N/A";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Recent Vehicles</h3>
        <Link to="/company/vehicles">
          <Button variant="link" className="text-brand-purple p-0">View All</Button>
        </Link>
      </div>
      
      {vehicles.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <Car className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No vehicles yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first vehicle.</p>
          <div className="mt-6">
            <Link to="/company/vehicles/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/Day
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.slice(0, 5).map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {vehicle.vehicle_images?.find((img) => img.is_primary)?.image_url ? (
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={vehicle.vehicle_images.find((img) => img.is_primary)?.image_url} 
                            alt={vehicle.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Car className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vehicle.transmission}, {vehicle.seats} seats
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${vehicle.price_per_day}/day</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatLocation(vehicle.location)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vehicle.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {vehicle.is_available ? 'Available' : 'Not Available'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentVehicles;
