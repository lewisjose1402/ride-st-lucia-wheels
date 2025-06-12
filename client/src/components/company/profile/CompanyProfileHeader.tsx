
import React from 'react';

interface CompanyProfileHeaderProps {
  isLoading: boolean;
}

const CompanyProfileHeader: React.FC<CompanyProfileHeaderProps> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
      <h2 className="text-xl font-semibold">Company Information</h2>
      <p className="text-gray-600">Update your company profile information</p>
    </div>
  );
};

export default CompanyProfileHeader;
