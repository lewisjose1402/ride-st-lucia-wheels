
import React from 'react';

type DashboardWelcomeProps = {
  companyName: string;
};

const DashboardWelcome = ({ companyName }: DashboardWelcomeProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold">
        Welcome back, {companyName || "Company"}!
      </h2>
      <p className="text-gray-600 mt-2">
        Manage your vehicles, bookings, and company profile from your dashboard.
      </p>
    </div>
  );
};

export default DashboardWelcome;
