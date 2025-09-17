
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
      className="fixed top-0 right-0 h-full w-[85%] max-w-[1200px] z-50 overflow-y-auto border-l border-border/20 shadow-2xl"
      style={{
        background: "linear-gradient(135deg, hsl(var(--background)/0.98) 0%, hsl(var(--muted)/0.95) 100%)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Premium background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/3 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-muted/15 via-transparent to-transparent" />
        
        {/* Minimal floating elements */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-primary/15 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -80, 0],
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 10,
              }}
            />
          ))}
        </div>
        
        {/* Refined grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Sophisticated header */}
      <div className="sticky top-0 z-20 border-b border-border/30 backdrop-blur-xl">
        <div className="bg-background/95 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                  <Crown className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Vehicle Comparison
                </h2>
                <p className="text-muted-foreground">Professional analysis & insights</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full h-12 w-12 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
              onClick={onClearAll}
            >
              <X className="h-6 w-6" />
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
              <TableRow className="border-border/50 hover:bg-muted/30">
                <TableHead className="w-[200px] text-muted-foreground"></TableHead>
                {vehicles.map((vehicle, index) => (
                  <TableHead key={vehicle.name} className="min-w-[280px]">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Vehicle Card */}
                      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-muted/40 to-muted/70 border border-border/30 shadow-2xl backdrop-blur-xl mb-6 group hover:border-primary/40 transition-all duration-500">
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/40 group-hover:border-primary/60 transition-colors duration-500" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/40 group-hover:border-primary/60 transition-colors duration-500" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/40 group-hover:border-primary/60 transition-colors duration-500" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/40 group-hover:border-primary/60 transition-colors duration-500" />

                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={vehicle.image}
                            alt={vehicle.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                          
                          {/* Premium badge */}
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-gradient-to-r from-primary/90 to-primary text-white border-0 shadow-xl backdrop-blur-xl">
                              <Award className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          </div>
                        </div>

                        {/* Vehicle Info */}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-white mb-3 group-hover:text-foreground transition-colors">
                            {vehicle.name}
                          </h3>
                          
                          {/* Action Buttons */}
                          <div className="grid grid-cols-1 gap-2 mb-3">
                            <Button
                              variant="outline"
                              className="w-full text-sm bg-muted/60 border-border/40 text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:border-primary/40 backdrop-blur-xl transition-all duration-500"
                              asChild
                            >
                              <a href={vehicle.configureUrl}>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Configure
                              </a>
                            </Button>
                            <Button
                              variant="secondary"
                              className="w-full text-sm bg-gradient-to-r from-primary/20 to-primary/20 border border-primary/30 text-foreground/80 hover:from-primary/30 hover:to-primary/30 hover:text-foreground backdrop-blur-xl transition-all duration-500"
                              asChild
                            >
                              <a href={`/test-drive?model=${encodeURIComponent(vehicle.name)}`}>
                                <Star className="h-4 w-4 mr-2" />
                                Test Drive
                              </a>
                            </Button>
                          </div>
                          
                          <Button
                            className="w-full text-sm bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg shadow-primary/20 transition-all duration-500"
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
