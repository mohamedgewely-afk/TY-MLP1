
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ZoomIn, ZoomOut, RotateCw, Download, Share2, Heart, 
  ChevronLeft, ChevronRight, Info, Maximize, Minimize
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { contextualHaptic } from "@/utils/haptic";

interface EnhancedFullscreenViewerProps {
  isOpen: boolean;
  media: { url: string; alt: string } | null;
  allMedia: Array<{ url: string; alt: string }>;
  currentIndex: number;
  isGR: boolean;
  favorites: string[];
  onClose: () => void;
  onToggleFavorite: (url: string) => void;
  onNavigate: (index: number) => void;
}

const EnhancedFullscreenViewer: React.FC<EnhancedFullscreenViewerProps> = ({
  isOpen,
  media,
  allMedia,
  currentIndex,
  isGR,
  favorites,
  onClose,
  onToggleFavorite,
  onNavigate,
}) => {
  const { isMobile } = useDeviceInfo();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset state when media changes
  useEffect(() => {
    if (media) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setRotation(0);
    }
  }, [media?.url]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (currentIndex < allMedia.length - 1) {
            onNavigate(currentIndex + 1);
          }
          break;
        case '+':
        case '=':
          setZoom(prev => Math.min(prev + 0.25, 5));
          break;
        case '-':
          setZoom(prev => Math.max(prev - 0.25, 0.5));
          break;
        case '0':
          setZoom(1);
          setPan({ x: 0, y: 0 });
          break;
        case 'r':
          setRotation(prev => prev + 90);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, allMedia.length, onClose, onNavigate]);

  // Mouse/touch interactions for pan and zoom
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Pinch to zoom for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      setDragStart({ x: distance, y: zoom });
    }
  }, [zoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      const scale = distance / dragStart.x;
      const newZoom = Math.max(0.5, Math.min(dragStart.y * scale, 5));
      setZoom(newZoom);
    }
  }, [dragStart]);

  const handleShare = async () => {
    contextualHaptic.buttonPress();
    if (navigator.share && media) {
      try {
        await navigator.share({
          title: 'Toyota Vehicle Image',
          url: media.url,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const handleDownload = () => {
    contextualHaptic.buttonPress();
    if (media) {
      const link = document.createElement('a');
      link.href = media.url;
      link.download = 'toyota-image.jpg';
      link.click();
    }
  };

  if (!isOpen || !media) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Header Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Badge className="bg-white/10">
                    {currentIndex + 1} of {allMedia.length}
                  </Badge>
                  <span className="text-sm opacity-80">{media.alt}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {!isMobile && (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.5))}
                        className="text-white hover:bg-white/10"
                      >
                        <ZoomOut className="w-5 h-5" />
                      </Button>
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setZoom(prev => Math.min(prev + 0.25, 5))}
                        className="text-white hover:bg-white/10"
                      >
                        <ZoomIn className="w-5 h-5" />
                      </Button>
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setRotation(prev => prev + 90)}
                        className="text-white hover:bg-white/10"
                      >
                        <RotateCw className="w-5 h-5" />
                      </Button>
                    </>
                  )}
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onToggleFavorite(media.url)}
                    className="text-white hover:bg-white/10"
                  >
                    <Heart className={[
                      "w-5 h-5",
                      favorites.includes(media.url) ? "fill-red-500 text-red-500" : ""
                    ].join(" ")} />
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleShare}
                    className="text-white hover:bg-white/10"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleDownload}
                    className="text-white hover:bg-white/10"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onClose}
                    className="text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Image */}
        <div
          className="flex-1 flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
          onClick={() => setShowControls(!showControls)}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <motion.img
            key={media.url}
            src={media.url}
            alt={media.alt}
            className="max-w-full max-h-full object-contain select-none"
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px) rotate(${rotation}deg)`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            drag={zoom > 1}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (zoom > 1) {
                setPan(prev => ({
                  x: prev.x + info.offset.x,
                  y: prev.y + info.offset.y
                }));
              }
            }}
          />
        </div>

        {/* Navigation Arrows */}
        {allMedia.length > 1 && (
          <>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                contextualHaptic.buttonPress();
                onNavigate(currentIndex - 1);
              }}
              disabled={currentIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                contextualHaptic.buttonPress();
                onNavigate(currentIndex + 1);
              }}
              disabled={currentIndex === allMedia.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}

        {/* Mobile Zoom Controls */}
        {isMobile && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.5))}
              className="text-white hover:bg-white/10"
            >
              <ZoomOut className="w-5 h-5" />
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="text-white hover:bg-white/10"
            >
              {zoom === 1 ? <Maximize /> : <Minimize />}
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setZoom(prev => Math.min(prev + 0.25, 5))}
              className="text-white hover:bg-white/10"
            >
              <ZoomIn className="w-5 h-5" />
            </Button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedFullscreenViewer;
