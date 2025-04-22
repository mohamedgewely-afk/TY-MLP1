
import React from "react";
import { VehicleModel } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
} from "@/components/ui/table";
import CompareControlsBar from "./CompareControlsBar";
import ComparisonSection from "./ComparisonSection";

interface DesktopComparisonViewProps {
  vehicles: VehicleModel[];
  sections: Array<{
    title: string;
    items: Array<{
      label: string;
      getValue: (v: VehicleModel) => string;
    }>;
  }>;
  showOnlyDifferences: boolean;
  onShowDifferencesChange: (value: boolean) => void;
  onRemove: (name: string) => void;
  onClearAll?: () => void;
  flyInRef: React.RefObject<HTMLDivElement>;
}

const DesktopComparisonView: React.FC<DesktopComparisonViewProps> = ({
  vehicles,
  sections,
  showOnlyDifferences,
  onShowDifferencesChange,
  onRemove,
  onClearAll,
  flyInRef,
}) => {
  return (
    <div
      ref={flyInRef}
      className="fixed top-0 right-0 h-full w-[90%] max-w-[1000px] z-50 bg-white shadow-2xl overflow-y-auto border-l border-gray-200"
    >
      <div className="sticky top-0 bg-white border-b flex items-center justify-between p-3 z-10">
        <h2 className="text-lg font-semibold text-gray-800">Vehicle Comparison</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-full p-2 h-8 w-8"
          onClick={onClearAll}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">
        <CompareControlsBar
          vehicles={vehicles}
          showOnlyDifferences={showOnlyDifferences}
          onShowDifferencesChange={onShowDifferencesChange}
          onRemove={onRemove}
          onClearAll={onClearAll}
        />
        
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]"></TableHead>
                {vehicles.map((vehicle) => (
                  <TableHead key={vehicle.name} className="min-w-[250px]">
                    <div className="relative">
                      <div className="w-full aspect-video rounded-lg overflow-hidden mb-4 bg-gray-100">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{vehicle.name}</h3>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <Button
                          variant="outline"
                          className="w-full text-sm"
                          asChild
                        >
                          <a href={vehicle.configureUrl}>Configure</a>
                        </Button>
                        <Button
                          variant="secondary"
                          className="w-full text-sm"
                          asChild
                        >
                          <a href={`/test-drive?model=${encodeURIComponent(vehicle.name)}`}>Test Drive</a>
                        </Button>
                      </div>
                      <Button
                        variant="default"
                        className="w-full text-sm"
                        asChild
                      >
                        <a href="/enquire">Enquire Now</a>
                      </Button>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section) => (
                <ComparisonSection
                  key={section.title}
                  section={section}
                  vehicles={vehicles}
                  showOnlyDifferences={showOnlyDifferences}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DesktopComparisonView;
