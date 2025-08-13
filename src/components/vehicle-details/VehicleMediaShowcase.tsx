
import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Image as ImageIcon, 
  Video, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X,
  Heart,
  Share2,
  Download,
  Grid3X3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "@/hooks/use-swipeable";

interface MediaItem {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

interface VehicleMediaShowcaseProps {
  vehicle: VehicleModel;
}

const defaultMedia: MediaItem[] = [
  { 
    type: "image", 
    url: "https://www.toyota.com/content/dam/toyota/vehicles/2024/camry/images/desktop/hero/camry-24-hero-desktop-d.jpg",
    title: "Exterior Design",
    description: "Bold and sophisticated styling"
  },
  { 
    type: "image", 
    url: "https://www.toyota.com/content/dam/toyota/vehicles/2024/camry/images/desktop/gallery/camry-24-gallery-desktop-a.jpg",
    title: "Premium Interior",
    description: "Luxurious cabin experience"
  },
  { 
    type: "video", 
    url: "https://www.youtube.com/watch?v=vVHRErdPFtg",
    thumbnail: "https://i.ytimg.com/an_webp/vVHRErdPFtg/mqdefault_6s.webp?du=3000&sqp=CKCJx8QG&rs=AOn4CLDd8NlBDnBBfZwHLUgBv4LsY8CAVw",
    title: "Performance Video",
    description: "See the power in action"
  }
];

const VehicleMediaShowcase: React.FC<VehicleMediaShowcaseProps> = ({ vehicle }) => {
  const isMobile = useIsMobile();
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);

  const media: MediaItem[] = [
    { 
      type: "image", 
      url: vehicle.image,
      title: `${vehicle.name} Showcase`,
      description: "Premium automotive design"
    },
    ...defaultMedia,
  ];

  const filteredMedia = filter === 'all' 
    ? media 
    : media.filter(item => item.type === filter);

  const currentMedia = filteredMedia[current];

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % filteredMedia.length);
  }, [filteredMedia.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + filteredMedia.length) % filteredMedia.length);
  }, [filteredMedia.length]);

  const swipeHandlers = useSwipeable({
    onSwipeLeft: next,
    onSwipeRight: prev,
    threshold: 50
  });

  const handleFilterChange = (newFilter: 'all' | 'image' | 'video') => {
    setFilter(newFilter);
    setCurrent(0);
  };

  const toggleFavorite = (index: number) => {
    setFavorites(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fullscreen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          next();
          break;
        case 'Escape':
          e.preventDefault();
          setFullscreen(false);
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullscreen, prev, next]);

  return (
    <>
      <div className="toyota-container mb-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Media Gallery
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore {vehicle.name} from every angle
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg border">
            <div className="flex space-x-1">
              {[
                { key: 'all' as const, label: 'All', icon: Grid3X3 },
                { key: 'image' as const, label: 'Photos', icon: ImageIcon },
                { key: 'video' as const, label: 'Videos', icon: Video }
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={filter === key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleFilterChange(key)}
                  className={`rounded-full px-4 ${
                    filter === key 
                      ? 'bg-toyota-red text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Media Display */}
        <Card className="overflow-hidden">
          <div 
            {...swipeHandlers}
            className="relative aspect-video bg-black group cursor-pointer"
            onClick={() => setFullscreen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${current}-${filter}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                {currentMedia.type === "image" ? (
                  <img 
                    src={currentMedia.url} 
                    alt={currentMedia.title || `${vehicle.name} media`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      src={currentMedia.url}
                      poster={currentMedia.thumbnail}
                      className="w-full h-full object-cover"
                      loop
                      muted={isMuted}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVideoPlay();
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Button
                        size="lg"
                        className="rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVideoPlay();
                        }}
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {filteredMedia.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Actions */}
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/80 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(current);
                }}
              >
                <Heart className={`h-4 w-4 ${favorites.includes(current) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/80 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/80 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreen(true);
                }}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Video Controls */}
            {currentMedia.type === "video" && (
              <div className="absolute bottom-4 left-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-black/60 backdrop-blur-sm text-white border-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            )}

            {/* Media Info */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-end justify-between">
                <div>
                  <Badge className="mb-2 bg-toyota-red">
                    {currentMedia.type === 'video' ? 'Video' : 'Photo'}
                  </Badge>
                  {currentMedia.title && (
                    <h3 className="font-semibold">{currentMedia.title}</h3>
                  )}
                  {currentMedia.description && (
                    <p className="text-sm text-white/80">{currentMedia.description}</p>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {current + 1} / {filteredMedia.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          {showThumbnails && filteredMedia.length > 1 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {filteredMedia.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`flex-shrink-0 w-16 h-10 rounded overflow-hidden border-2 transition-all ${
                      current === index
                        ? 'border-toyota-red scale-105'
                        : 'border-transparent hover:border-gray-300'
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
        </Card>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
            onClick={() => setFullscreen(false)}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/80">
              <div className="text-white">
                <h3 className="font-semibold">{currentMedia.title}</h3>
                <p className="text-sm text-white/70">{current + 1} of {filteredMedia.length}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="h-5 w-5" />
                </Button>
                
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
                  onClick={() => setFullscreen(false)}
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
            <div className="flex items-center justify-between p-4 bg-black/80">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                disabled={filteredMedia.length <= 1}
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </Button>
              
              <div className="text-white text-sm">
                {current + 1} / {filteredMedia.length}
              </div>
              
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
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
