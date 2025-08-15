
import React from "react";
import { VehicleModel } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { X, Crown, Sparkles, Star, Award } from "lucide-react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
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
      className="fixed top-0 right-0 h-full w-[90%] max-w-[1000px] z-50 overflow-y-auto border-l-2 border-blue-500/20 shadow-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(55, 65, 81, 0.95) 0%, rgba(31, 41, 55, 0.98) 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/8 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-900/15 via-transparent to-transparent" />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -60, 0],
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-blue-500/20 backdrop-blur-2xl">
        <div className="bg-gradient-to-r from-gray-700/90 via-gray-800/95 to-gray-700/90 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Crown className="h-8 w-8 text-blue-500 animate-pulse" />
                <div className="absolute inset-0 h-8 w-8 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Vehicle Comparison
                </h2>
                <p className="text-gray-400 text-sm">Compare features and specifications</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full p-3 h-10 w-10 bg-gray-700/60 border border-gray-600/40 text-gray-300 hover:bg-blue-600/20 hover:text-white hover:border-blue-500/50 backdrop-blur-xl transition-all duration-500"
              onClick={onClearAll}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 relative z-10">
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
              <TableRow className="border-gray-600/50 hover:bg-gray-700/30">
                <TableHead className="w-[200px] text-gray-300"></TableHead>
                {vehicles.map((vehicle, index) => (
                  <TableHead key={vehicle.name} className="min-w-[280px]">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Vehicle Card */}
                      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-700/60 to-gray-800/80 border border-gray-600/30 shadow-2xl backdrop-blur-xl mb-6 group hover:border-blue-500/40 transition-all duration-500">
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500/40 group-hover:border-blue-400/60 transition-colors duration-500" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500/40 group-hover:border-blue-400/60 transition-colors duration-500" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500/40 group-hover:border-blue-400/60 transition-colors duration-500" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500/40 group-hover:border-blue-400/60 transition-colors duration-500" />

                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={vehicle.image}
                            alt={vehicle.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                          
                          {/* Premium badge */}
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-gradient-to-r from-blue-600/90 to-blue-500/90 text-white border-0 shadow-xl backdrop-blur-xl">
                              <Award className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          </div>
                        </div>

                        {/* Vehicle Info */}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-100 transition-colors">
                            {vehicle.name}
                          </h3>
                          
                          {/* Action Buttons */}
                          <div className="grid grid-cols-1 gap-2 mb-3">
                            <Button
                              variant="outline"
                              className="w-full text-sm bg-gray-700/60 border-gray-600/40 text-gray-300 hover:bg-gray-600/80 hover:text-white hover:border-blue-500/40 backdrop-blur-xl transition-all duration-500"
                              asChild
                            >
                              <a href={vehicle.configureUrl}>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Configure
                              </a>
                            </Button>
                            <Button
                              variant="secondary"
                              className="w-full text-sm bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 text-blue-200 hover:from-blue-600/30 hover:to-blue-500/30 hover:text-white backdrop-blur-xl transition-all duration-500"
                              asChild
                            >
                              <a href={`/test-drive?model=${encodeURIComponent(vehicle.name)}`}>
                                <Star className="h-4 w-4 mr-2" />
                                Test Drive
                              </a>
                            </Button>
                          </div>
                          
                          <Button
                            className="w-full text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all duration-500"
                            asChild
                          >
                            <a href="/enquire">
                              <Crown className="h-4 w-4 mr-2" />
                              Enquire Now
                            </a>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section, sectionIndex) => (
                <motion.tr
                  key={section.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.05 }}
                >
                  <ComparisonSection
                    section={section}
                    vehicles={vehicles}
                    showOnlyDifferences={showOnlyDifferences}
                  />
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DesktopComparisonView;
