
import React, { useState, useRef, useEffect } from "react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

const useFlyInAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.classList.add("animate-flyin-comparison");
    }
  }, []);

  return ref;
};

interface ComparisonTableProps {
  vehicles: VehicleModel[];
  onRemove: (name: string) => void;
  onClearAll?: () => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  vehicles,
  onRemove,
  onClearAll,
}) => {
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const isMobile = useIsMobile();
  const flyInRef = useFlyInAnimation();

  const sections = [
    {
      title: "Pricing",
      items: [
        { label: "Vehicle Price", getValue: (v: VehicleModel) => `AED ${v.price.toLocaleString()}` },
        { label: "Cash Price", getValue: (v: VehicleModel) => `AED ${(v.price * 0.93).toLocaleString()}` },
      ]
    },
    {
      title: "Specifications",
      items: [
        { label: "Engine", getValue: (v: VehicleModel) => v.specifications?.engine || v.features[0] || "N/A" },
        {
          label: "Power",
          getValue: (v: VehicleModel) =>
            (v.specifications && "power" in v.specifications && v.specifications.power)
              ? (v.specifications as any).power
              : "308 hp"
        },
        {
          label: "Range",
          getValue: (v: VehicleModel) =>
            (v.specifications && "range" in v.specifications && v.specifications.range)
              ? (v.specifications as any).range
              : "482 km"
        },
        {
          label: "Acceleration",
          getValue: (v: VehicleModel) =>
            (v.specifications && "acceleration" in v.specifications && v.specifications.acceleration)
              ? (v.specifications as any).acceleration
              : "0-100 km/h in 4.5s"
        },
      ]
    },
    {
      title: "Features",
      items: [
        { label: "Seats", getValue: (v: VehicleModel) => v.features[1] || "Leather seats" },
        { label: "Safety", getValue: (v: VehicleModel) => v.features[2] || "Advanced safety features" },
        { label: "Technology", getValue: (v: VehicleModel) => v.features[3] || "Smart technology package" },
      ]
    }
  ];

  const hasDifferences = (getValue: (v: VehicleModel) => string) => {
    const values = vehicles.map(getValue);
    return new Set(values).size > 1;
  };

  const CompareControllerBar = () => (
    <div className="w-full px-2 md:px-4 py-2 mb-4 rounded-xl bg-[#F1F0FB] border border-gray-200 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 shadow-sm">
      <div className="overflow-x-auto flex-1">
        <div className="flex gap-2">
          {vehicles.map((v) => (
            <div
              key={v.name}
              className="flex items-center px-3 py-2 bg-white border border-gray-100 rounded-lg min-w-[120px] gap-2 shadow-xs hover-scale"
            >
              <img
                src={v.image}
                alt={v.name}
                className="w-10 h-10 object-cover rounded"
              />
              <span className="truncate text-sm font-medium text-gray-700">{v.name}</span>
              <button
                onClick={() => onRemove(v.name)}
                className="ml-1 p-1 text-gray-500 hover:text-red-500"
                title={`Remove ${v.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row flex-wrap items-center gap-2 mt-1 md:mt-0">
        <Switch
          id="show-differences"
          checked={showOnlyDifferences}
          onCheckedChange={setShowOnlyDifferences}
        />
        <Label htmlFor="show-differences" className="text-sm text-gray-600">Show only differences</Label>
        {onClearAll && vehicles.length > 0 &&
          <Button
            variant="secondary"
            size="sm"
            className="ml-1"
            onClick={onClearAll}
          >
            Clear All
          </Button>
        }
      </div>
    </div>
  );

  const renderMobileView = () => (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
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
      
      <div className="p-3">
        <CompareControllerBar />
        
        {/* Vehicle Images and Names */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.name} className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="w-full aspect-video bg-gray-100">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold text-gray-800 mb-2">{vehicle.name}</h3>
                <div className="flex gap-1">
                  <Button variant="secondary" size="sm" className="text-xs flex-1 h-8" asChild>
                    <a href={vehicle.configureUrl}>Configure</a>
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs flex-1 h-8" asChild>
                    <a href={`/test-drive?model=${encodeURIComponent(vehicle.name)}`}>Test Drive</a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Data by Section */}
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="font-semibold text-base bg-gray-50 p-2 border-y">{section.title}</h3>
            
            {section.items.map((item) => (
              !showOnlyDifferences || hasDifferences(item.getValue) ? (
                <div key={item.label} className="border-b">
                  <div className="font-medium text-sm text-gray-700 p-2 bg-gray-50">{item.label}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2">
                    {vehicles.map((vehicle) => (
                      <div 
                        key={`${vehicle.name}-${item.label}`}
                        className={`p-2 rounded-md ${hasDifferences(item.getValue) ? "bg-gray-50 font-medium" : ""}`}
                      >
                        <span className="block text-sm truncate">{item.getValue(vehicle)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            ))}
          </div>
        ))}
        
        <div className="flex justify-end mt-6 mb-8">
          <Button variant="outline" className="mr-2" onClick={onClearAll}>
            Close Comparison
          </Button>
          <Button asChild>
            <a href="/enquire">Enquire Now</a>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderDesktopView = () => (
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
        <CompareControllerBar />
        
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
                <React.Fragment key={section.title}>
                  <TableRow>
                    <TableCell colSpan={vehicles.length + 1} className="bg-gray-50 font-semibold">
                      {section.title}
                    </TableCell>
                  </TableRow>
                  {section.items.map((item) => (
                    !showOnlyDifferences || hasDifferences(item.getValue) ? (
                      <TableRow key={item.label}>
                        <TableCell className="text-gray-500">{item.label}</TableCell>
                        {vehicles.map((vehicle) => (
                          <TableCell
                            key={`${vehicle.name}-${item.label}`}
                            className={`${
                              hasDifferences(item.getValue) ? "font-semibold" : ""
                            }`}
                          >
                            {item.getValue(vehicle)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ) : null
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );

  return isMobile ? renderMobileView() : renderDesktopView();
};

export default ComparisonTable;
