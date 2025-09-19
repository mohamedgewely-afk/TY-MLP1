import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
// import { PersonaData } from "@/types/persona";
import { 
  X, 
  Download, 
  Filter, 
  Eye, 
  EyeOff,
  ArrowUpDown,
  Info,
  Star,
  Shield,
  Zap,
  Check,
  Minus
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ComparisonSection {
  title: string;
  items: Array<{
    label: string;
    getValue: (v: VehicleModel) => string | number;
    highlight?: boolean;
    unit?: string;
    format?: 'currency' | 'number' | 'text';
  }>;
}

interface ProfessionalComparisonTableProps {
  vehicles: VehicleModel[];
  onRemoveVehicle: (vehicleId: string) => void;
  onClearComparison: () => void;
  persona?: any;
}

const COMPARISON_SECTIONS: ComparisonSection[] = [
  {
    title: "Pricing & Value",
    items: [
      { 
        label: "Starting Price", 
        getValue: (v) => v.price, 
        format: 'currency',
        highlight: true 
      },
      { 
        label: "Monthly EMI", 
        getValue: (v) => Math.round(v.price * 0.02), 
        format: 'currency',
        unit: '/mo' 
      },
      { 
        label: "Warranty", 
        getValue: (v) => "5 years / 100,000 km", 
        format: 'text' 
      },
      { 
        label: "Service Package", 
        getValue: (v) => "3 years included", 
        format: 'text' 
      }
    ]
  },
  {
    title: "Performance Specifications",
    items: [
      { 
        label: "Engine Type", 
        getValue: (v) => v.category === 'Hybrid' ? 'Hybrid' : v.category === 'Electric' ? 'Electric' : 'Petrol',
        format: 'text',
        highlight: true
      },
      { 
        label: "Power Output", 
        getValue: (v) => v.category === 'Hybrid' ? 218 : v.category === 'Electric' ? 201 : 203,
        format: 'number',
        unit: ' HP'
      },
      { 
        label: "Fuel Efficiency", 
        getValue: (v) => v.category === 'Hybrid' ? 25.2 : v.category === 'Electric' ? 450 : 22.2,
        format: 'number',
        unit: ' km/L'
      },
      { 
        label: "Transmission", 
        getValue: (v) => "CVT Automatic",
        format: 'text'
      }
    ]
  },
  {
    title: "Safety & Technology",
    items: [
      { 
        label: "Safety Rating", 
        getValue: (v) => "5 Stars",
        format: 'text',
        highlight: true
      },
      { 
        label: "Toyota Safety Sense", 
        getValue: (v) => "TSS 2.0",
        format: 'text'
      },
      { 
        label: "Infotainment Screen", 
        getValue: (v) => "12.3",
        format: 'number',
        unit: '"'
      },
      { 
        label: "Connectivity", 
        getValue: (v) => "Apple CarPlay & Android Auto",
        format: 'text'
      }
    ]
  },
  {
    title: "Comfort & Convenience",
    items: [
      { 
        label: "Seating Capacity", 
        getValue: (v) => v.name.includes('Land Cruiser') ? 8 : 5,
        format: 'number',
        unit: ' seats'
      },
      { 
        label: "Climate Control", 
        getValue: (v) => "Dual Zone Automatic",
        format: 'text'
      },
      { 
        label: "Sunroof", 
        getValue: (v) => v.name.includes('Corolla') ? "Not Available" : "Panoramic",
        format: 'text'
      },
      { 
        label: "Wireless Charging", 
        getValue: (v) => "Standard",
        format: 'text'
      }
    ]
  }
];

const ProfessionalComparisonTable: React.FC<ProfessionalComparisonTableProps> = ({
  vehicles,
  onRemoveVehicle,
  onClearComparison,
  persona
}) => {
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const sortedVehicles = useMemo(() => {
    return [...vehicles].sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price;
      }
      return a.name.localeCompare(b.name);
    });
  }, [vehicles, sortBy]);

  const hasDifferences = (getValue: (v: VehicleModel) => string | number) => {
    const values = sortedVehicles.map(getValue);
    return new Set(values).size > 1;
  };

  const formatValue = (
    value: string | number, 
    format?: 'currency' | 'number' | 'text',
    unit?: string | ((v: VehicleModel) => string),
    vehicle?: VehicleModel
  ) => {
    switch (format) {
      case 'currency':
        return `AED ${typeof value === 'number' ? value.toLocaleString() : value}${unit || ''}`;
      case 'number':
        const unitStr = typeof unit === 'function' && vehicle ? unit(vehicle) : unit || '';
        return `${value}${unitStr}`;
      default:
        return value.toString();
    }
  };

  const downloadPDF = () => {
    // In a real implementation, this would generate and download a PDF
    console.log('Downloading comparison PDF...');
  };

  if (isMobile) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Mobile Header */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Vehicle Comparison</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearComparison}
                className="text-gray-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
                className="flex-1"
              >
                {showOnlyDifferences ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showOnlyDifferences ? 'Show All' : 'Differences'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadPDF}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>

          {/* Mobile Vehicle Cards */}
          <div className="p-4 space-y-4">
            {sortedVehicles.map((vehicle) => (
              <div key={vehicle.id} className="border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900">{vehicle.name}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveVehicle(vehicle.id)}
                    className="text-gray-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Starting Price</span>
                    <span className="font-semibold">AED {vehicle.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly EMI</span>
                    <span className="font-semibold">AED {Math.round(vehicle.price * 0.02).toLocaleString()}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel Type</span>
                    <span className="font-semibold">
                      {vehicle.category === 'Hybrid' ? 'Hybrid' : vehicle.category === 'Electric' ? 'Electric' : 'Petrol'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
      >
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Vehicle Comparison</h2>
              <p className="text-gray-600 text-sm">Professional side-by-side analysis</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortBy(sortBy === 'name' ? 'price' : 'name')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowUpDown className="h-4 w-4 mr-1" />
                Sort by {sortBy === 'name' ? 'Price' : 'Name'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {showOnlyDifferences ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showOnlyDifferences ? 'Show All Features' : 'Show Differences Only'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={downloadPDF}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-1" />
                Export PDF
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearComparison}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Vehicle Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sortedVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-sm">{vehicle.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveVehicle(vehicle.id)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Starting from</span>
                    <span className="font-bold text-gray-900">AED {vehicle.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex gap-1">
                    <Badge className="text-xs bg-blue-100 text-blue-700 border-0">
                      <Shield className="h-2.5 w-2.5 mr-1" />
                      5-Star
                    </Badge>
                    {vehicle.category === 'Hybrid' && (
                      <Badge className="text-xs bg-green-100 text-green-700 border-0">
                        <Zap className="h-2.5 w-2.5 mr-1" />
                        Hybrid
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Professional Comparison Table */}
        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-700 text-sm min-w-[200px]">
                  Specification
                </th>
                {sortedVehicles.map((vehicle) => (
                  <th key={vehicle.id} className="text-center p-4 font-semibold text-gray-700 text-sm min-w-[150px]">
                    {vehicle.name}
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {COMPARISON_SECTIONS.map((section) => (
                <React.Fragment key={section.title}>
                  {/* Section Header */}
                  <tr>
                    <td
                      colSpan={sortedVehicles.length + 1}
                      className="bg-gradient-to-r from-gray-100 to-gray-50 p-4 font-bold text-gray-800 text-sm border-t border-gray-200"
                    >
                      <button
                        onClick={() => setSelectedSection(selectedSection === section.title ? null : section.title)}
                        className="flex items-center gap-2 w-full text-left"
                      >
                        <Info className="h-4 w-4 text-gray-600" />
                        {section.title}
                      </button>
                    </td>
                  </tr>
                  
                  {/* Section Items */}
                  {section.items.map((item) => {
                    const showRow = !showOnlyDifferences || hasDifferences(item.getValue);
                    if (!showRow) return null;
                    
                    return (
                      <tr key={item.label} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 text-sm text-gray-600 font-medium">
                          {item.label}
                          {item.highlight && (
                            <Star className="h-3 w-3 text-yellow-500 inline ml-1" />
                          )}
                        </td>
                        {sortedVehicles.map((vehicle) => {
                          const value = item.getValue(vehicle);
                          const formattedValue = formatValue(value, item.format, item.unit, vehicle);
                          const isDifferent = hasDifferences(item.getValue);
                          
                          return (
                            <td
                              key={`${vehicle.id}-${item.label}`}
                              className={`p-4 text-sm text-center ${
                                isDifferent && item.highlight 
                                  ? 'font-bold text-gray-900' 
                                  : 'text-gray-700'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1">
                                {formattedValue}
                                {isDifferent && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full opacity-60" />
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Professional Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full opacity-60" />
                Differences highlighted
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                Key specifications
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <span>Last updated: {new Date().toLocaleDateString()}</span>
              <span>•</span>
              <span>All prices include VAT</span>
              <span>•</span>
              <span>Subject to change without notice</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfessionalComparisonTable;