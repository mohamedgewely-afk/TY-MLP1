
import React from "react";
import { VehicleModel } from "@/types/vehicle";
import { TableRow, TableCell } from "@/components/ui/table";

interface ComparisonSectionProps {
  section: {
    title: string;
    items: Array<{
      label: string;
      getValue: (v: VehicleModel) => string;
    }>;
  };
  vehicles: VehicleModel[];
  showOnlyDifferences: boolean;
}

export const hasDifferences = (getValue: (v: VehicleModel) => string, vehicles: VehicleModel[]) => {
  const values = vehicles.map(getValue);
  return new Set(values).size > 1;
};

const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  section,
  vehicles,
  showOnlyDifferences,
}) => {
  return (
    <React.Fragment>
      <TableRow>
        <TableCell colSpan={vehicles.length + 1} className="bg-gray-50 font-semibold">
          {section.title}
        </TableCell>
      </TableRow>
      {section.items.map((item) => (
        !showOnlyDifferences || hasDifferences(item.getValue, vehicles) ? (
          <TableRow key={item.label}>
            <TableCell className="text-gray-500">{item.label}</TableCell>
            {vehicles.map((vehicle) => (
              <TableCell
                key={`${vehicle.name}-${item.label}`}
                className={`${
                  hasDifferences(item.getValue, vehicles) ? "font-semibold" : ""
                }`}
              >
                {item.getValue(vehicle)}
              </TableCell>
            ))}
          </TableRow>
        ) : null
      ))}
    </React.Fragment>
  );
};

export default ComparisonSection;
