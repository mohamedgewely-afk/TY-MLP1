import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Camera, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  Maximize2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface VirtualShowroomProps {
  imageUrl: string;
}

interface Hotspot {
  id: string;
  position: { x: number; y: number };
  content: string;
}

const VirtualShowroom: React.FC<VirtualShowroomProps> = ({ imageUrl }) => {
  const [is360View, setIs360View] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showHotspots, setShowHotspots] = useState(false);

  const hotspots: Hotspot[] = [
    {
      id: "engine",
      position: { x: 0.3, y: 0.4 },
      content: "Powerful Engine"
    },
    {
      id: "interior",
      position: { x: 0.7, y: 0.6 },
      content: "Luxurious Interior"
    }
  ];

  const handleToggle360View = () => {
    setIs360View(!is360View);
  };

  const handleZoomIn = () => {
    setZoomLevel(zoomLevel + 0.1);
  };

  const handleZoomOut = () => {
    setZoomLevel(zoomLevel - 0.1);
  };

  const handleToggleHotspots = () => {
    setShowHotspots(!showHotspots);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="relative">
          <motion.img
            src={imageUrl}
            alt="Virtual Showroom"
            style={{
              width: '100%',
              transform: `scale(${zoomLevel})`,
              transition: 'transform 0.3s ease-in-out'
            }}
          />
          {showHotspots &&
            hotspots.map(hotspot => (
              <div
                key={hotspot.id}
                className="absolute rounded-full bg-red-500 w-4 h-4"
                style={{
                  left: `${hotspot.position.x * 100}%`,
                  top: `${hotspot.position.y * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white text-xs rounded px-2 py-1">
                  {hotspot.content}
                </span>
              </div>
            ))}
        </div>
        <div className="mt-4 flex space-x-2">
          <Button onClick={handleToggle360View} variant="outline">
            {is360View ? <RotateCcw className="mr-2 h-4 w-4" /> : <Camera className="mr-2 h-4 w-4" />}
            {is360View ? 'Exit 360 View' : 'Enter 360 View'}
          </Button>
          <Button onClick={handleZoomIn} variant="outline">
            <ZoomIn className="mr-2 h-4 w-4" />
            Zoom In
          </Button>
          <Button onClick={handleZoomOut} variant="outline">
            <ZoomOut className="mr-2 h-4 w-4" />
            Zoom Out
          </Button>
          <Button onClick={handleToggleHotspots} variant="outline">
            {showHotspots ? <Eye className="mr-2 h-4 w-4" /> : <Maximize2 className="mr-2 h-4 w-4" />}
            {showHotspots ? 'Hide Hotspots' : 'Show Hotspots'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VirtualShowroom;
