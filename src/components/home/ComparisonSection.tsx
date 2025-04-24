
import React from 'react';
import { VehicleModel } from "@/types/vehicle";
import ComparisonTable from "@/components/home/ComparisonTable";

interface ComparisonSectionProps {
  compareList: string[];
  vehicles: VehicleModel[];
  onRemove: (name: string) => void;
}

const ComparisonSection: React.FC<ComparisonSectionProps> = ({ 
  compareList, 
  vehicles,
  onRemove 
}) => {
  // Only show comparison section if there are vehicles to compare
  if (compareList.length === 0) return null;

  // Filter vehicles to only those in the compare list
  const vehiclesToCompare = vehicles.filter(v => compareList.includes(v.name));

  const clearAll = () => {
    compareList.forEach(name => onRemove(name));
  };

  return (
    <section 
      id="comparison-section" 
      className="py-16 bg-gray-50 dark:bg-gray-800"
    >
      <div className="toyota-container">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Compare Vehicles
        </h2>
        
        <ComparisonTable
          vehicles={vehiclesToCompare}
          onRemove={onRemove}
          onClearAll={clearAll}
        />
      </div>
    </section>
  );
};

export default ComparisonSection;
