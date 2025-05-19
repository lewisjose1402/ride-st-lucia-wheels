
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Car, Star } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link to="/company/vehicles/add">
          <Button variant="outline" className="w-full justify-start">
            <Plus className="mr-2 h-4 w-4" />
            Add New Vehicle
          </Button>
        </Link>
        <Link to="/company/vehicles">
          <Button variant="outline" className="w-full justify-start">
            <Car className="mr-2 h-4 w-4" />
            Manage Vehicles
          </Button>
        </Link>
        <Link to="/company/profile">
          <Button variant="outline" className="w-full justify-start">
            <Star className="mr-2 h-4 w-4" />
            Update Company Profile
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
