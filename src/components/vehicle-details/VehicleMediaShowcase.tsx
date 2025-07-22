import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Image as ImageIcon, Video, Play, Pause, Volume2, VolumeX, RotateCcw, Download, Share2, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "@/hooks/use-swipeable";

// Enhanced media item types
interface MediaItem {
  type: "image" | "video" | "360";
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

// Premium Toyota media gallery with real images
const defaultMedia: MediaItem[] = [
  { 
    type: "image", 
    url: "https://www.toyota.com/content/dam/toyota/vehicles/2024/camry/images/desktop/hero/camry-24-hero-desktop-d.jpg",
    title: "Exterior Profile",
    description: "Aerodynamic design meets premium styling"
  },
  { 
    type: "image", 
    url: "https://www.toyota.com/content/dam/toyota/vehicles/2024/camry/images/desktop/gallery/camry-24-gallery-desktop-a.jpg",
    title: "Interior Luxury",
    description: "Sophisticated cabin with premium materials"
  },
  { 
    type: "image", 
    url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80",
    title: "Technology Hub",
    description: "Advanced infotainment and connectivity"
  },
  { 
    type: "image", 
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    title: "Hybrid Performance",
    description: "Efficient power delivery system"
  },
  { 
    type: "video", 
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80",
    title: "Dynamic Demo",
    description: "See the hybrid system in action"
  },
  { 
    type: "360", 
    url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=1200&q=80",
    title: "360° View",
    description: "Interactive exterior exploration"
  },
];

interface VehicleMediaShowcaseProps {
  vehicle: VehicleModel;
}

const VehicleMediaShowcase: React.FC<VehicleMediaShowcaseProps> = ({ vehicle }) => {
  const isMobile = useIsMobile();
  const media: MediaItem[] = [
    { 
      type: "image", 
      url: vehicle.image,
      title: "Hero Shot",
      description: `${vehicle.name} in all its glory`
    },
    ...defaultMedia,
  ];

  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video' | '360'>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhanced navigation
  const next = () => setCurrent((prev) => (prev + 1) % filteredMedia.length);
  const prev = () => setCurrent((prev) => (prev - 1 + filteredMedia.length) % filteredMedia.length);

  // Filter media based on active filter
  const filteredMedia = media.filter(m => 
    activeFilter === 'all' ? true : m.type === activeFilter
  );

  // Add swipe functionality for main media display
  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: next,
    onSwipeRight: prev,
    threshold: 50
  });

  // Add swipe functionality for thumbnail gallery
  const thumbnailSwipeRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: next,
    onSwipeRight: prev,
    threshold: 30
  });

  // Handle filter change
  const handleFilterChange = (filter: 'all' | 'image' | 'video' | '360') => {
    setActiveFilter(filter);
    if (filter !== 'all' && media[current].type !== filter) {
      const firstMatchingIndex = media.findIndex(m => m.type === filter);
      if (firstMatchingIndex >= 0) {
        setCurrent(firstMatchingIndex);
      }
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (fullscreen) return;
    
    const interval = setInterval(() => {
      if (activeFilter === 'all' || media[current].type === 'image') {
        next();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [current, activeFilter, fullscreen]);

  // Video controls
  const togglePlay = () => {
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

  const currentMedia = media[current];

  return (
    <>
      <div className="toyota-container mt-6 mb-12">
        <motion.div 
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-black shadow-2xl border border-gray-200 dark:border-gray-800"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Enhanced Media Display */}
          <div 
            ref={containerRef}
            className="relative h-[350px] md:h-[550px] xl:h-[650px] flex items-center justify-center overflow-hidden bg-black"
          >
            <div ref={swipeableRef} className="w-full h-full touch-pan-y">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative"
                >
                  {currentMedia.type === "image" ? (
                    <img 
                      src={currentMedia.url} 
                      alt={currentMedia.title || `${vehicle.name} showcase`} 
                      className="object-cover w-full h-full transition-all duration-500" 
                    />
                  ) : currentMedia.type === "video" ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        src={currentMedia.url}
                        className="object-cover w-full h-full"
                        poster={currentMedia.thumbnail || vehicle.image}
                        loop
                        muted={isMuted}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                      
                      {/* Video Controls */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={togglePlay}
                            className="bg-black/50 backdrop-blur border-white/20 text-white hover:bg-black/70"
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleMute}
                            className="bg-black/50 backdrop-blur border-white/20 text-white hover:bg-black/70"
                          >
                            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          </Button>
                        </div>
                        
                        <Badge className="bg-black/50 backdrop-blur border-white/20 text-white">
                          <Video className="h-3 w-3 mr-1" />
                          Video
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    // 360° View placeholder
                    <div className="relative w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                      <img 
                        src={currentMedia.url} 
                        alt={currentMedia.title || "360° View"} 
                        className="object-cover w-full h-full opacity-80" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <RotateCcw className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <Badge className="absolute top-4 left-4 bg-purple-500 text-white">
                        360° Interactive
                      </Badge>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <motion.div 
              className="absolute inset-y-0 left-0 flex items-center"
              whileHover={{ scale: 1.1 }}
            >
              <Button 
                variant="outline" 
                size="icon" 
                className="ml-4 rounded-full bg-black/50 backdrop-blur border-white/20 text-white hover:bg-black/70 h-12 w-12"
                onClick={prev}
                aria-label="Previous media"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </motion.div>
            
            <motion.div 
              className="absolute inset-y-0 right-0 flex items-center"
              whileHover={{ scale: 1.1 }}
            >
              <Button 
                variant="outline" 
                size="icon" 
                className="mr-4 rounded-full bg-black/50 backdrop-blur border-white/20 text-white hover:bg-black/70 h-12 w-12"
                onClick={next}
                aria-label="Next media"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </motion.div>
            
            {/* Enhanced Action Buttons */}
            <div className="absolute top-4 right-4 flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-black/50 backdrop-blur border-white/20 text-white hover:bg-black/70"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-black/50 backdrop-blur border-white/20 text-white hover:bg-black/70"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFullscreen(true)}
                className="bg-black/50 backdrop-blur border-white/20 text-white hover:bg-black/70"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Enhanced Media Type Filters */}
            <div className="absolute top-4 left-4">
              <div className="flex items-center space-x-2">
                {[
                  { key: 'all', label: 'All', icon: null },
                  { key: 'image', label: 'Photos', icon: <ImageIcon className="h-3 w-3" /> },
                  { key: 'video', label: 'Videos', icon: <Video className="h-3 w-3" /> },
                  { key: '360', label: '360°', icon: <RotateCcw className="h-3 w-3" /> }
                ].map((filter) => (
                  <Button
                    key={filter.key}
                    size="sm"
                    variant={activeFilter === filter.key ? "default" : "outline"}
                    className={`text-xs whitespace-nowrap ${
                      activeFilter === filter.key 
                        ? "bg-toyota-red text-white border-toyota-red" 
                        : "bg-black/50 backdrop-blur border-white/20 text-white hover:bg-black/70"
                    }`}
                    onClick={() => handleFilterChange(filter.key as any)}
                  >
                    {filter.icon && <span className="mr-1">{filter.icon}</span>}
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Enhanced Media Information Panel */}
          <div className="p-6 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {currentMedia.title || `${vehicle.name} Gallery`}
                </h3>
                {currentMedia.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {currentMedia.description}
                  </p>
                )}
              </div>
              <Badge variant="outline" className="px-3 py-1">
                {current + 1} of {media.length}
              </Badge>
            </div>
            
            {/* Enhanced Thumbnail Gallery with Swipe */}
            <div ref={thumbnailSwipeRef} className="touch-pan-y">
              <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
                {media.map((item, idx) => (
                  <motion.div
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`flex-shrink-0 w-24 h-16 cursor-pointer rounded-xl overflow-hidden border-2 transition-all relative ${
                      current === idx 
                        ? 'border-toyota-red shadow-lg scale-105' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    } ${activeFilter !== 'all' && item.type !== activeFilter ? "opacity-40" : ""}`}
                    whileHover={{ scale: current === idx ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.type === "image" || item.type === "360" ? (
                      <img src={item.url} alt={`Media ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black relative">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={`Video ${idx + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="bg-gray-800 w-full h-full" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="h-6 w-6 text-white drop-shadow-lg" />
                        </div>
                      </div>
                    )}
                    
                    {/* Type indicator */}
                    <div className="absolute top-1 right-1">
                      {item.type === 'video' && (
                        <div className="w-2 h-2 bg-red-500 rounded-full shadow-sm" />
                      )}
                      {item.type === '360' && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full shadow-sm" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Swipe Indicator */}
            <div className="flex justify-center mt-4 md:hidden">
              <div className="flex space-x-2">
                {media.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === current ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced Fullscreen Modal - Keep existing code */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreen(false)}
          >
            {/* Fullscreen Header */}
            <div className="flex justify-between items-center p-6 bg-black/50 backdrop-blur">
              <div className="text-white">
                <h3 className="font-semibold">{currentMedia.title}</h3>
                <p className="text-sm text-gray-300">{current + 1} of {media.length}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="bg-black/50 text-white border-white/20">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-black/50 text-white border-white/20">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-black/50 text-white border-white/20"
                  onClick={() => setFullscreen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Fullscreen Content */}
            <div className="flex-1 flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="max-h-[80vh] max-w-full"
                >
                  {currentMedia.type === "image" || currentMedia.type === "360" ? (
                    <img 
                      src={currentMedia.url} 
                      alt={`Fullscreen ${currentMedia.title || vehicle.name}`} 
                      className="max-h-full max-w-full object-contain rounded-lg shadow-2xl" 
                    />
                  ) : (
                    <video 
                      src={currentMedia.url} 
                      controls 
                      className="max-h-full max-w-full rounded-lg shadow-2xl" 
                      autoPlay 
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Fullscreen Navigation */}
            <div className="flex justify-between items-center p-6 bg-black/50 backdrop-blur">
              <Button 
                variant="outline" 
                className="bg-black/50 text-white border-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </Button>
              
              <span className="text-white text-sm">
                {current + 1} of {media.length}
              </span>
              
              <Button 
                variant="outline" 
                className="bg-black/50 text-white border-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
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
