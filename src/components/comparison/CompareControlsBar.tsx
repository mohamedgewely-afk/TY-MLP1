
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { X } from "lucide-react";

interface CompareControlsBarProps {
  vehicles: VehicleModel[];
  showOnlyDifferences: boolean;
  onShowDifferencesChange: (value: boolean) => void;
  onRemove: (name: string) => void;
  onClearAll?: () => void;
}

const CompareControlsBar: React.FC<CompareControlsBarProps> = ({
  vehicles,
  showOnlyDifferences,
  onShowDifferencesChange,
  onRemove,
  onClearAll,
}) => {
  return (
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
          onCheckedChange={onShowDifferencesChange}
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
};

export default CompareControlsBar;
