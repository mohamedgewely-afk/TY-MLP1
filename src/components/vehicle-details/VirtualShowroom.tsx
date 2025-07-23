
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Eye, Maximize2, Minimize2 } from 'lucide-react';
import { useDeviceInfo } from '@/hooks/use-device-info';
import { contextualHaptic } from '@/utils/haptic';

interface VirtualShowroomProps {
  vehicleName: string;
}

const VirtualShowroom: React.FC<VirtualShowroomProps> = ({ vehicleName }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const { isMobile } = useDeviceInfo();

  const showroomUrl = "https://www.virtualshowroom.toyota.ae/configurator/en";

  const handleOpenShowroom = () => {
    contextualHaptic.buttonPress();
    setShowIframe(true);
  };

  const handleExternalLink = () => {
    contextualHaptic.buttonPress();
    window.open(showroomUrl, '_blank', 'noopener,noreferrer');
  };

  const toggleFullscreen = () => {
    contextualHaptic.selectionChange();
    setIsFullscreen(!isFullscreen);
  };

  const closeShowroom = () => {
    contextualHaptic.buttonPress();
    setShowIframe(false);
    setIsFullscreen(false);
  };

  return (
    <div className="relative">
      <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Eye className="h-5 w-5 text-primary" />
            Virtual Showroom Experience
          </CardTitle>
          <p className="text-muted-foreground">
            Explore the {vehicleName} in our immersive 3D virtual showroom
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showIframe ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleOpenShowroom}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                <Eye className="mr-2 h-4 w-4" />
                Launch Virtual Showroom
              </Button>
              <Button
                onClick={handleExternalLink}
                variant="outline"
                className="w-full border-primary/30 hover:bg-primary/10"
                size="lg"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Interactive 3D Experience</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={toggleFullscreen}
                    variant="outline"
                    size="sm"
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    onClick={closeShowroom}
                    variant="outline"
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
              </div>
              <div className={`relative overflow-hidden rounded-lg border-2 border-primary/20 ${
                isFullscreen ? 'fixed inset-4 z-50 bg-background' : ''
              }`}>
                <iframe
                  src={showroomUrl}
                  title={`${vehicleName} Virtual Showroom`}
                  className={`w-full border-0 ${
                    isFullscreen ? 'h-full' : isMobile ? 'h-[400px]' : 'h-[600px]'
                  }`}
                  allow="fullscreen; accelerometer; gyroscope; vr"
                  loading="lazy"
                />
                {isFullscreen && (
                  <Button
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 z-10"
                    variant="secondary"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-1">360° View</h4>
              <p className="text-muted-foreground">Explore every angle</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-1">Interior Tour</h4>
              <p className="text-muted-foreground">Experience the cabin</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-1">Color Options</h4>
              <p className="text-muted-foreground">See all variants</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualShowroom;
