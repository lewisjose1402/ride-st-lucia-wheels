
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const VehiclesHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Your Vehicles</h2>
        <p className="text-gray-600">Manage all your vehicles in one place</p>
      </div>
      <Link to="/company/vehicles/add">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </Link>
    </div>
  );
};

export default VehiclesHeader;
