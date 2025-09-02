
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Share2, Heart, Download, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EnhancedSceneData } from "@/types/gallery";
import { cn } from "@/lib/utils";

interface PremiumExpandedViewProps {
  experience: EnhancedSceneData | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const PremiumExpandedView: React.FC<PremiumExpandedViewProps> = ({
  experience,
  isOpen,
  onClose,
  onNext,
  onPrev
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const images = experience?.media.gallery || [experience?.media.primaryImage].filter(Boolean);

  useEffect(() => {
    setCurrentImageIndex(0);
    setIsImageLoaded(false);
  }, [experience]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onClose();
          }
          break;
        case 'ArrowLeft':
          if (images && currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
            setIsImageLoaded(false);
          } else {
            onPrev?.();
          }
          break;
        case 'ArrowRight':
          if (images && currentImageIndex < images.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
            setIsImageLoaded(false);
          } else {
            onNext?.();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev, images, currentImageIndex, isFullscreen]);

  if (!experience || !isOpen) return null;

  const nextImage = () => {
    if (images && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setIsImageLoaded(false);
    }
  };

  const prevImage = () => {
    if (images && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
      setIsImageLoaded(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay className="bg-black/90 backdrop-blur-sm" />
          <DialogContent 
            className={cn(
              "max-w-none w-[95vw] h-[95vh] p-0 border-0 bg-background/95 backdrop-blur-xl rounded-3xl overflow-hidden",
              isFullscreen && "w-screen h-screen rounded-none"
            )}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col h-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/20">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-foreground truncate">
                      {experience.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {experience.scene}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onPrev && (
                    <Button variant="ghost" size="sm" onClick={onPrev}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  )}
                  {onNext && (
                    <Button variant="ghost" size="sm" onClick={onNext}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <div className="w-px h-6 bg-border mx-2" />
                  
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex min-h-0">
                {/* Image Section */}
                <div className="flex-1 relative bg-gradient-to-br from-muted/20 to-muted/5">
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="relative w-full h-full max-w-5xl max-h-full">
                      {images && images[currentImageIndex] && (
                        <img
                          src={images[currentImageIndex]}
                          alt={`${experience.title} - Image ${currentImageIndex + 1}`}
                          className={cn(
                            "w-full h-full object-contain rounded-2xl shadow-2xl transition-all duration-500",
                            isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                          )}
                          onLoad={() => setIsImageLoaded(true)}
                        />
                      )}
                      
                      {!isImageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                      )}

                      {/* Image Navigation */}
                      {images && images.length > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={prevImage}
                            disabled={currentImageIndex === 0}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={nextImage}
                            disabled={currentImageIndex === images.length - 1}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                          
                          {/* Image Indicators */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setCurrentImageIndex(index);
                                  setIsImageLoaded(false);
                                }}
                                className={cn(
                                  "w-3 h-3 rounded-full transition-all duration-200",
                                  index === currentImageIndex 
                                    ? "bg-primary scale-110" 
                                    : "bg-white/50 hover:bg-white/70"
                                )}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="w-96 bg-card border-l border-border/20 overflow-y-auto">
                  <div className="p-6 space-y-6">
                    <div>
                      <p className="text-foreground leading-relaxed">
                        {experience.description}
                      </p>
                    </div>

                    {experience.specs && Object.keys(experience.specs).length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Specifications
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(experience.specs).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center py-3 border-b border-border/10">
                              <span className="text-muted-foreground font-medium">{key}</span>
                              <span className="text-foreground font-semibold">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {experience.tags && experience.tags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          Features
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {experience.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 pt-4">
                      <Button className="w-full" size="lg">
                        Book Test Drive
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        Download Brochure
                        <Download className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default PremiumExpandedView;
