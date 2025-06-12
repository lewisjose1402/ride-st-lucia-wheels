
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const MissingProfileState = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
      <h2 className="text-xl font-semibold text-red-600">Company Profile Missing</h2>
      <p className="text-gray-600 mt-2 mb-4">
        Your company profile needs to be created before you can access the dashboard.
      </p>
      <Link to="/company/profile">
        <Button>Complete Your Profile</Button>
      </Link>
    </div>
  );
};

export default MissingProfileState;
