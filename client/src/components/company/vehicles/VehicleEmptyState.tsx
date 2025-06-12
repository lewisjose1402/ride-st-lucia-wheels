
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';

const VehicleEmptyState: React.FC = () => {
  return (
    <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
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
  );
};

export default VehicleEmptyState;
