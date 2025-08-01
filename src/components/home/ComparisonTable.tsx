
import React, { useState } from "react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileComparisonView from "../comparison/MobileComparisonView";
import DesktopComparisonView from "../comparison/DesktopComparisonView";
import { Persona } from "@/types/persona";

const useFlyInAnimation = () => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.classList.add("animate-fade-in");
    }
  }, []);

  return ref;
};

interface ComparisonTableProps {
  vehicles: VehicleModel[];
  onRemove: (name: string) => void;
  onClearAll?: () => void;
  personaData?: Persona | null;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  vehicles,
  onRemove,
  onClearAll,
  personaData,
}) => {
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const isMobile = useIsMobile();
  const flyInRef = useFlyInAnimation();

  const sections = [
    {
      title: "Pricing",
      items: [
        { 
          label: "Vehicle Price", 
          getValue: (v: VehicleModel) => `AED ${v.price.toLocaleString()}`,
          highlight: true
        },
        { 
          label: "Cash Price", 
          getValue: (v: VehicleModel) => `AED ${(v.price * 0.93).toLocaleString()}`,
          subtext: "7% discount"
        },
      ]
    },
    {
      title: "Performance Specifications",
      items: [
        { 
          label: "Engine", 
          getValue: (v: VehicleModel) => v.specifications?.engine || v.features[0] || "N/A",
          icon: "⚡"
        },
        {
          label: "Power Output",
          getValue: (v: VehicleModel) =>
            (v.specifications && "power" in v.specifications && v.specifications.power)
              ? (v.specifications as any).power
              : "218 HP",
          icon: "🔋"
        },
        {
          label: "Driving Range",
          getValue: (v: VehicleModel) =>
            (v.specifications && "range" in v.specifications && v.specifications.range)
              ? (v.specifications as any).range
              : "550 km",
          icon: "🛣️"
        },
        {
          label: "Acceleration",
          getValue: (v: VehicleModel) =>
            (v.specifications && "acceleration" in v.specifications && v.specifications.acceleration)
              ? (v.specifications as any).acceleration
              : "0-100 km/h in 8.1s",
          icon: "🚀"
        },
      ]
    },
    {
      title: "Premium Features",
      items: [
        { 
          label: "Seating & Comfort", 
          getValue: (v: VehicleModel) => v.features[1] || "Premium leather seats with heating",
          icon: "🪑"
        },
        { 
          label: "Safety Systems", 
          getValue: (v: VehicleModel) => v.features[2] || "Toyota Safety Sense 3.0",
          icon: "🛡️"
        },
        { 
          label: "Technology Suite", 
          getValue: (v: VehicleModel) => v.features[3] || "12.3\" infotainment with wireless connectivity",
          icon: "📱"
        },
      ]
    }
  ];

  return isMobile ? (
    <MobileComparisonView
      vehicles={vehicles}
      sections={sections}
      showOnlyDifferences={showOnlyDifferences}
      onShowDifferencesChange={setShowOnlyDifferences}
      onRemove={onRemove}
      onClearAll={onClearAll}
    />
  ) : (
    <DesktopComparisonView
      vehicles={vehicles}
      sections={sections}
      showOnlyDifferences={showOnlyDifferences}
      onShowDifferencesChange={setShowOnlyDifferences}
      onRemove={onRemove}
      onClearAll={onClearAll}
      flyInRef={flyInRef}
    />
  );
};

export default ComparisonTable;
