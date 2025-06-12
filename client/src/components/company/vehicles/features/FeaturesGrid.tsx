
import React from "react";
import FeatureCheckbox from "./FeatureCheckbox";
import { featuresList } from "./featuresList";

const FeaturesGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {featuresList.map((feature) => (
        <FeatureCheckbox 
          key={feature.id} 
          id={feature.id} 
          label={feature.label} 
        />
      ))}
    </div>
  );
};

export default FeaturesGrid;
