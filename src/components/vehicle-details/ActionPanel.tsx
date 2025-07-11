
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Share2, 
  Calendar, 
  Calculator,
  PencilRuler,
  Phone,
  MessageCircle,
  Download
} from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: vehicle.name,
          text: `Check out this ${vehicle.name} at Toyota UAE`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownloadBrochure = () => {
    // Simulate brochure download
    const link = document.createElement('a');
    link.href = `/brochures/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}-brochure.pdf`;
    link.download = `${vehicle.name}-brochure.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCallDealer = () => {
    window.location.href = 'tel:+97141234567';
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'm interested in the ${vehicle.name}. Can you provide more information?`);
    window.open(`https://wa.me/97141234567?text=${message}`, '_blank');
  };

  if (isMobile) {
    return (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t shadow-xl"
      >
        <div className="p-4">
          {/* Quick Actions Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFavorite}
                className={`${isFavorite ? 'text-red-500' : 'text-muted-foreground'}`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="sm" onClick={handleDownloadBrochure}>
                <Download className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Starting from</div>
              <div className="text-lg font-bold text-primary">
                AED {vehicle.price.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button onClick={onBookTestDrive} variant="outline" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Test Drive
            </Button>
            
            <Button onClick={onCarBuilder} className="flex-1">
              <PencilRuler className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={onFinanceCalculator}>
              <Calculator className="h-4 w-4 mr-1" />
              Finance
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleCallDealer}>
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleWhatsApp}>
              <MessageCircle className="h-4 w-4 mr-1" />
              Chat
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Desktop version
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block"
    >
      <Card className="p-6 w-80 shadow-xl border-0 bg-background/95 backdrop-blur-sm">
        <div className="space-y-4">
          {/* Vehicle Info */}
          <div className="text-center">
            <h3 className="font-bold text-lg mb-1">{vehicle.name}</h3>
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Badge variant="secondary">{vehicle.type}</Badge>
              <Badge variant="outline">{vehicle.fuelType}</Badge>
            </div>
            <div className="text-2xl font-black text-primary">
              AED {vehicle.price.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Starting from</div>
          </div>

          {/* Main Actions */}
          <div className="space-y-3">
            <Button onClick={onBookTestDrive} className="w-full" size="lg">
              <Calendar className="h-5 w-5 mr-2" />
              Book Test Drive
            </Button>
            
            <Button onClick={onCarBuilder} variant="outline" className="w-full" size="lg">
              <PencilRuler className="h-5 w-5 mr-2" />
              Configure Vehicle
            </Button>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" onClick={onFinanceCalculator}>
              <Calculator className="h-4 w-4 mr-1" />
              Finance
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleDownloadBrochure}>
              <Download className="h-4 w-4 mr-1" />
              Brochure
            </Button>
          </div>

          {/* Contact Actions */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t">
            <Button variant="ghost" size="sm" onClick={handleCallDealer}>
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleWhatsApp}>
              <MessageCircle className="h-4 w-4 mr-1" />
              WhatsApp
            </Button>
          </div>

          {/* Utility Actions */}
          <div className="flex justify-center space-x-4 pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFavorite}
              className={`${isFavorite ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ActionPanel;
