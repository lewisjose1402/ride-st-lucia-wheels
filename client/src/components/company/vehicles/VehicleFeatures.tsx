
import React from "react";
import FeaturesGrid from "./features/FeaturesGrid";

const VehicleFeatures: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Features</h3>
      <FeaturesGrid />
    </div>
  );
};

export default VehicleFeatures;
