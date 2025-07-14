import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Heart,
  Share2,
  Download,
  Settings,
  PencilRuler,
  Loader2
} from "lucide-react";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

interface ActionPanelProps {
  vehicle: VehicleModel;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
  onFinanceCalculator: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  vehicle,
  isFavorite,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleBrochureDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Download Started",
        description: `${vehicle.name} brochure is being downloaded`,
        duration: 3000,
      });
      
      // In real implementation, this would trigger actual PDF download
      const link = document.createElement('a');
      link.href = '#'; // Would be actual brochure PDF URL
      link.download = `${vehicle.name}-brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* Desktop Action Panel */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-0 overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-bold text-lg mb-1">{vehicle.name}</h3>
                  <p className="text-2xl font-black text-primary">
                    AED {vehicle.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Starting from AED 899/month</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={onBookTestDrive}
                    className="bg-primary hover:bg-primary/90 text-white font-semibold"
                    size="sm"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Test Drive
                  </Button>

                  <Button
                    onClick={onCarBuilder}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white font-semibold"
                    size="sm"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </Button>

                  <Button
                    onClick={onFinanceCalculator}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white font-semibold"
                    size="sm"
                  >
                    <PencilRuler className="mr-2 h-4 w-4" />
                    Finance
                  </Button>

                  {/* Enhanced Brochure Download Button */}
                  <Button
                    onClick={handleBrochureDownload}
                    disabled={isDownloading}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white font-semibold"
                    size="sm"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span className="text-xs">Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Brochure
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <Button
                    onClick={onToggleFavorite}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                    {isFavorite ? 'Saved' : 'Save'}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Mobile Sticky Action Bar */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-lg">AED {vehicle.price.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">From AED 899/month</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={onToggleFavorite}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                </Button>
                
                <Button
                  onClick={handleBrochureDownload}
                  disabled={isDownloading}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                >
                  {isDownloading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={onBookTestDrive}
                className="bg-primary hover:bg-primary/90 text-white font-semibold h-12"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book Test Drive
              </Button>

              <Button
                onClick={onCarBuilder}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white font-semibold h-12"
              >
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ActionPanel;
