
import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2,
  X,
  Grid3X3,
  Image as ImageIcon,
  Video,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";

interface MediaItem {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  title: string;
  description: string;
}

interface VehicleMediaShowcaseProps {
  vehicle: VehicleModel;
}

const VehicleMediaShowcase: React.FC<VehicleMediaShowcaseProps> = ({ vehicle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const mediaItems: MediaItem[] = [
    {
      type: "image",
      url: vehicle.image,
      title: `${vehicle.name} Exterior`,
      description: "Premium automotive design"
    },
    {
      type: "image",
      url: "https://www.toyota.com/content/dam/toyota/vehicles/2024/camry/images/desktop/hero/camry-24-hero-desktop-d.jpg",
      title: "Front Profile",
      description: "Bold and sophisticated styling"
    },
    {
      type: "image",
      url: "https://www.toyota.com/content/dam/toyota/vehicles/2024/camry/images/desktop/gallery/camry-24-gallery-desktop-a.jpg",
      title: "Interior View",
      description: "Luxurious cabin experience"
    },
    {
      type: "video",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail: "https://i.ytimg.com/an_webp/vVHRErdPFtg/mqdefault_6s.webp?du=3000&sqp=CKCJx8QG&rs=AOn4CLDd8NlBDnBBfZwHLUgBv4LsY8CAVw",
      title: "Performance Video",
      description: "See the power in action"
    }
  ];

  const filteredMedia = filter === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.type === filter);

  const currentMedia = filteredMedia[currentIndex];

  // Handle loading state
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredMedia.length);
  }, [filteredMedia.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredMedia.length) % filteredMedia.length);
  }, [filteredMedia.length]);

  const handleFilterChange = (newFilter: 'all' | 'image' | 'video') => {
    setFilter(newFilter);
    setCurrentIndex(0);
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full mb-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mx-auto mb-6"></div>
          <div className="aspect-video bg-muted rounded-lg mb-4"></div>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-16 h-10 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full mb-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Media Gallery
          </h2>
          <p className="text-muted-foreground">
            Explore {vehicle.name} from every angle
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-background border rounded-full p-1 shadow-sm">
            {[
              { key: 'all' as const, label: 'All', icon: Grid3X3, count: mediaItems.length },
              { key: 'image' as const, label: 'Photos', icon: ImageIcon, count: mediaItems.filter(m => m.type === 'image').length },
              { key: 'video' as const, label: 'Videos', icon: Video, count: mediaItems.filter(m => m.type === 'video').length }
            ].map(({ key, label, icon: Icon, count }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "ghost"}
                size="sm"
                onClick={() => handleFilterChange(key)}
                className={`rounded-full px-4 ${
                  filter === key 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Main Media Display */}
        <div className="relative bg-background border rounded-lg overflow-hidden shadow-sm group">
          <div className="relative aspect-video bg-muted">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentIndex}-${filter}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                {currentMedia?.type === "image" ? (
                  <img 
                    src={currentMedia.url} 
                    alt={currentMedia.title} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : currentMedia?.type === "video" ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      src={currentMedia.url}
                      poster={currentMedia.thumbnail}
                      className="w-full h-full object-cover"
                      loop
                      muted={isMuted}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Button
                          size="lg"
                          onClick={toggleVideoPlay}
                          className="rounded-full bg-white/90 text-black hover:bg-white"
                        >
                          <Play className="h-8 w-8 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {filteredMedia.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Video Controls */}
            {currentMedia?.type === "video" && (
              <div className="absolute bottom-4 left-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-black/80 text-white border-white/20 hover:bg-black/90"
                  onClick={toggleVideoPlay}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-black/80 text-white border-white/20 hover:bg-black/90"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/90 hover:bg-white shadow-md"
                onClick={() => setIsFullscreen(true)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/90 hover:bg-white shadow-md"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Media Info */}
            {currentMedia && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-end justify-between">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white">
                    <Badge className="mb-2 bg-primary">
                      {currentMedia.type === 'video' ? 'Video' : 'Photo'}
                    </Badge>
                    <h3 className="font-semibold text-sm">{currentMedia.title}</h3>
                    <p className="text-xs text-white/80">{currentMedia.description}</p>
                  </div>
                  
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 text-white text-sm">
                    {currentIndex + 1} / {filteredMedia.length}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {filteredMedia.length > 1 && (
            <div className="p-4 bg-muted/30 border-t">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {filteredMedia.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 relative w-16 h-10 rounded overflow-hidden border-2 transition-all ${
                      currentIndex === index
                        ? 'border-primary scale-105'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={item.type === 'video' ? item.thumbnail : item.url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && currentMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm">
              <div className="text-white">
                <h3 className="font-semibold">{currentMedia.title}</h3>
                <p className="text-sm text-white/70">{currentIndex + 1} of {filteredMedia.length}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsFullscreen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="max-w-full max-h-full">
                {currentMedia.type === "image" ? (
                  <img 
                    src={currentMedia.url} 
                    alt={currentMedia.title} 
                    className="max-w-full max-h-full object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <video 
                    src={currentMedia.url} 
                    controls 
                    className="max-w-full max-h-full"
                    autoPlay
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                disabled={filteredMedia.length <= 1}
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </Button>
              
              <div className="text-white text-sm">
                {currentIndex + 1} / {filteredMedia.length}
              </div>
              
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                disabled={filteredMedia.length <= 1}
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VehicleMediaShowcase;
