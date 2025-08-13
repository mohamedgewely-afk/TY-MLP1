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
  RotateCcw, 
  Download, 
  Share2, 
  Heart, 
  X,
  Zap,
  Eye,
  Camera,
  Film,
  Layers,
  Settings,
  Info,
  Grid3X3,
  Sparkles,
  Award,
  Star,
  ChevronUp,
  ChevronDown,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  MoreHorizontal,
  Bookmark,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Palette,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "@/hooks/use-swipeable";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Enhanced media item types with luxury features
interface MediaItem {
  type: "image" | "video" | "360" | "ar" | "interactive";
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  duration?: number;
  resolution?: string;
  isPremium?: boolean;
  isNew?: boolean;
  photographer?: string;
  location?: string;
  timestamp?: string;
}

// Premium Toyota media gallery with enhanced content
const defaultMedia: MediaItem[] = [
  { 
    type: "image", 
    url: "https://www.toyota.com/content/dam/toyota/vehicles/2024/camry/images/desktop/hero/camry-24-hero-desktop-d.jpg",
    title: "Dramatic Exterior Profile",
    description: "Sophisticated aerodynamic design meets premium luxury styling",
    category: "Exterior",
    tags: ["Luxury", "Design", "Premium"],
    resolution: "4K",
    isPremium: true,
    photographer: "Toyota Design Studio",
    location: "Tokyo, Japan"
  },
  { 
    type: "image", 
    url: "https://www.toyota.com/content/dam/toyota/vehicles/2024/camry/images/desktop/gallery/camry-24-gallery-desktop-a.jpg",
    title: "Luxurious Interior Sanctuary",
    description: "Premium materials and craftsmanship in every detail",
    category: "Interior",
    tags: ["Luxury", "Comfort", "Premium Materials"],
    resolution: "4K",
    isPremium: true
  },
  { 
    type: "video", 
    url: "https://www.youtube.com/watch?v=vVHRErdPFtg",
    thumbnail: "https://i.ytimg.com/an_webp/vVHRErdPFtg/mqdefault_6s.webp?du=3000&sqp=CKCJx8QG&rs=AOn4CLDd8NlBDnBBfZwHLUgBv4LsY8CAVw",
    title: "Dynamic Performance Showcase",
    description: "Experience the power and precision of Toyota engineering",
    category: "Performance",
    tags: ["Performance", "Engineering", "Innovation"],
    duration: 120,
    isPremium: true,
    isNew: true
  },
  { 
    type: "360", 
    url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=1200&q=80",
    title: "360° Immersive Experience",
    description: "Complete virtual exploration of your future Toyota",
    category: "Interactive",
    tags: ["360°", "Interactive", "VR Ready"],
    isPremium: true
  },
  { 
    type: "ar", 
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    title: "AR Visualization",
    description: "See your Toyota in your own driveway with augmented reality",
    category: "AR Experience",
    tags: ["AR", "Visualization", "Future Tech"],
    isPremium: true,
    isNew: true
  },
  { 
    type: "interactive", 
    url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80",
    title: "Interactive Features Tour",
    description: "Explore every feature with our interactive guide",
    category: "Features",
    tags: ["Interactive", "Features", "Technology"],
    isPremium: true
  }
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
      title: "Hero Gallery",
      description: `${vehicle.name} - The future of automotive excellence`,
      category: "Showcase",
      isPremium: true
    },
    ...defaultMedia,
  ];

  // Enhanced state management
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video' | '360' | 'ar' | 'interactive'>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(50);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [autoplay, setAutoplay] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFlippedH, setIsFlippedH] = useState(false);
  const [isFlippedV, setIsFlippedV] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'theater' | 'cinema'>('standard');
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax effect for premium feel
  const parallaxX = useTransform(mouseX, [0, 1], [-10, 10]);
  const parallaxY = useTransform(mouseY, [0, 1], [-10, 10]);

  // Filter media based on active filter
  const filteredMedia = media.filter(m => 
    activeFilter === 'all' ? true : m.type === activeFilter
  );

  // Enhanced navigation with smooth animations
  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % filteredMedia.length);
  }, [filteredMedia.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + filteredMedia.length) % filteredMedia.length);
  }, [filteredMedia.length]);

  // Enhanced swipe functionality with luxury haptic feedback
  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: next,
    onSwipeRight: prev,
    threshold: 30,
    debug: false
  });

  const thumbnailSwipeRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: next,
    onSwipeRight: prev,
    threshold: 25,
    debug: false
  });

  // Mouse tracking for parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    }
  };

  // Enhanced filter management
  const handleFilterChange = (filter: 'all' | 'image' | 'video' | '360' | 'ar' | 'interactive') => {
    setActiveFilter(filter);
    if (filter !== 'all') {
      const firstMatchingIndex = media.findIndex(m => m.type === filter);
      if (firstMatchingIndex >= 0) {
        setCurrent(firstMatchingIndex);
      }
    }
  };

  // Premium autoplay with smart pause detection
  useEffect(() => {
    if (!autoplay || fullscreen || isZoomed) return;
    
    const interval = setInterval(() => {
      if (activeFilter === 'all' || media[current].type === 'image') {
        next();
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [current, activeFilter, fullscreen, autoplay, isZoomed, next]);

  // Preload next images for smooth experience
  useEffect(() => {
    const preloadNext = () => {
      const nextIndex = (current + 1) % media.length;
      const nextMedia = media[nextIndex];
      if (nextMedia.type === 'image') {
        const img = new Image();
        img.src = nextMedia.url;
      }
    };
    preloadNext();
  }, [current, media]);

  // Enhanced video controls
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

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };

  // Image manipulation functions
  const resetImageTransforms = () => {
    setZoomLevel(1);
    setRotation(0);
    setIsFlippedH(false);
    setIsFlippedV(false);
    setIsZoomed(false);
  };

  const toggleFavorite = (index: number) => {
    setFavorites(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const currentMedia = media[current];
  const isCurrentFavorite = favorites.includes(current);

  return (
    <>
      <div className="toyota-container mt-8 mb-16">
        {/* Premium Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-toyota-red to-transparent rounded-full"></div>
            <Sparkles className="h-6 w-6 text-toyota-red mx-4" />
            <div className="h-1 w-16 bg-gradient-to-r from-toyota-red via-transparent to-transparent rounded-full"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">
            Premium Media Gallery
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Experience {vehicle.name} like never before
          </p>
        </motion.div>

        {/* Enhanced Media Controls Bar */}
        <motion.div 
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 mb-6 shadow-xl border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeFilter} onValueChange={(value) => handleFilterChange(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="all" className="text-xs">
                <Grid3X3 className="h-4 w-4 mr-1" />
                All
              </TabsTrigger>
              <TabsTrigger value="image" className="text-xs">
                <ImageIcon className="h-4 w-4 mr-1" />
                Photos
              </TabsTrigger>
              <TabsTrigger value="video" className="text-xs">
                <Video className="h-4 w-4 mr-1" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="360" className="text-xs">
                <RotateCcw className="h-4 w-4 mr-1" />
                360°
              </TabsTrigger>
              <TabsTrigger value="ar" className="text-xs">
                <Zap className="h-4 w-4 mr-1" />
                AR
              </TabsTrigger>
              <TabsTrigger value="interactive" className="text-xs">
                <Layers className="h-4 w-4 mr-1" />
                Interactive
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Advanced Controls */}
          <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Play className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <Switch checked={autoplay} onCheckedChange={setAutoplay} />
                <span className="text-sm text-gray-600 dark:text-gray-400">Autoplay</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <Switch checked={showInfo} onCheckedChange={setShowInfo} />
                <span className="text-sm text-gray-600 dark:text-gray-400">Info</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-toyota-red/10 text-toyota-red border-toyota-red/20">
                <Award className="h-3 w-3 mr-1" />
                Premium Gallery
              </Badge>
              <Badge variant="outline">
                {current + 1} of {media.length}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Main Media Display */}
        <motion.div 
          className={`relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 ${
            viewMode === 'theater' ? 'aspect-video' : viewMode === 'cinema' ? 'aspect-[21/9]' : 'aspect-[4/3]'
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)' }}
        >
          <div 
            ref={containerRef}
            className="relative h-[400px] md:h-[600px] xl:h-[700px] flex items-center justify-center overflow-hidden"
            onMouseMove={handleMouseMove}
          >
            <div 
              ref={swipeableRef} 
              className="w-full h-full touch-manipulation select-none"
              style={{ touchAction: 'pan-x' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 100, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full h-full relative"
                  style={{ 
                    x: parallaxX, 
                    y: parallaxY,
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg) scaleX(${isFlippedH ? -1 : 1}) scaleY(${isFlippedV ? -1 : 1})`
                  }}
                >
                  {currentMedia.type === "image" ? (
                    <img 
                      src={currentMedia.url} 
                      alt={currentMedia.title || `${vehicle.name} showcase`} 
                      className="object-cover w-full h-full transition-all duration-500 cursor-zoom-in" 
                      onClick={() => setIsZoomed(!isZoomed)}
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
                    </div>
                  ) : currentMedia.type === "360" ? (
                    <div className="relative w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
                      <img 
                        src={currentMedia.url} 
                        alt={currentMedia.title || "360° View"} 
                        className="object-cover w-full h-full opacity-80" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="w-24 h-24 border-4 border-white/30 border-t-white rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <RotateCcw className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <Badge className="absolute top-6 left-6 bg-purple-500 text-white px-4 py-2">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        360° Interactive Experience
                      </Badge>
                    </div>
                  ) : currentMedia.type === "ar" ? (
                    <div className="relative w-full h-full bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
                      <img 
                        src={currentMedia.url} 
                        alt={currentMedia.title || "AR Experience"} 
                        className="object-cover w-full h-full opacity-80" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="flex items-center justify-center"
                        >
                          <Zap className="h-12 w-12 text-white" />
                        </motion.div>
                      </div>
                      <Badge className="absolute top-6 left-6 bg-emerald-500 text-white px-4 py-2">
                        <Zap className="h-4 w-4 mr-2" />
                        AR Visualization
                      </Badge>
                    </div>
                  ) : (
                    <div className="relative w-full h-full bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center">
                      <img 
                        src={currentMedia.url} 
                        alt={currentMedia.title || "Interactive Experience"} 
                        className="object-cover w-full h-full opacity-80" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="flex items-center justify-center"
                        >
                          <Layers className="h-12 w-12 text-white" />
                        </motion.div>
                      </div>
                      <Badge className="absolute top-6 left-6 bg-orange-500 text-white px-4 py-2">
                        <Layers className="h-4 w-4 mr-2" />
                        Interactive Features
                      </Badge>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Premium Navigation Controls */}
            <motion.div 
              className="absolute inset-y-0 left-0 flex items-center opacity-0 hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
            >
              <Button 
                variant="outline" 
                size="icon" 
                className="ml-6 rounded-full bg-black/60 backdrop-blur-xl border-white/20 text-white hover:bg-black/80 h-14 w-14 shadow-xl"
                onClick={prev}
                aria-label="Previous media"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </motion.div>
            
            <motion.div 
              className="absolute inset-y-0 right-0 flex items-center opacity-0 hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
            >
              <Button 
                variant="outline" 
                size="icon" 
                className="mr-6 rounded-full bg-black/60 backdrop-blur-xl border-white/20 text-white hover:bg-black/80 h-14 w-14 shadow-xl"
                onClick={next}
                aria-label="Next media"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </motion.div>

            {/* Enhanced Action Bar */}
            <div className="absolute top-6 right-6 flex flex-col space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFavorite(current)}
                className={`bg-black/60 backdrop-blur-xl border-white/20 text-white hover:bg-black/80 shadow-xl ${
                  isCurrentFavorite ? 'bg-red-500/80 border-red-400/40' : ''
                }`}
              >
                <Heart className={`h-4 w-4 ${isCurrentFavorite ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`bg-black/60 backdrop-blur-xl border-white/20 text-white hover:bg-black/80 shadow-xl ${
                  isBookmarked ? 'bg-blue-500/80 border-blue-400/40' : ''
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="bg-black/60 backdrop-blur-xl border-white/20 text-white hover:bg-black/80 shadow-xl"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFullscreen(true)}
                className="bg-black/60 backdrop-blur-xl border-white/20 text-white hover:bg-black/80 shadow-xl"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Image Controls (for images only) */}
            {currentMedia.type === "image" && (
              <div className="absolute bottom-6 left-6 flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 3))}
                  className="bg-black/60 backdrop-blur-xl border-white/20 text-white hover:bg-black/80 shadow-xl"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 0.5))}
                  className="bg-black/60 backdrop-blur-xl border-white/20 text-white hover:bg-black/80 shadow-xl"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation(prev => prev + 90)}
                  className="bg-black/60 backdrop-blur-xl border-white/20 text-white hover:bg-black/80 shadow-xl"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetImageTransforms}
                  className="bg-black/60 backdrop-blur-xl border-white/20 text-white hover:bg-black/80 shadow-xl"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Video Controls */}
            {currentMedia.type === "video" && (
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={togglePlay}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleMute}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      
                      <div className="flex items-center space-x-2 w-24">
                        <Volume2 className="h-3 w-3 text-white" />
                        <Slider
                          value={[volume]}
                          onValueChange={handleVolumeChange}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <Badge className="bg-toyota-red/20 text-white border-toyota-red/40">
                      <Video className="h-3 w-3 mr-1" />
                      Premium Video
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Premium Status Indicators */}
            <div className="absolute top-6 left-6 flex flex-col space-y-2">
              {currentMedia.isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-3 py-1">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Premium
                </Badge>
              )}
              {currentMedia.isNew && (
                <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold px-3 py-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  New
                </Badge>
              )}
              {currentMedia.category && (
                <Badge variant="outline" className="bg-black/60 backdrop-blur-xl text-white border-white/20">
                  {currentMedia.category}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Enhanced Media Information Panel */}
          {showInfo && (
            <motion.div 
              className="p-8 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentMedia.title || `${vehicle.name} Gallery`}
                    </h3>
                    {currentMedia.isPremium && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  
                  {currentMedia.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-4 leading-relaxed">
                      {currentMedia.description}
                    </p>
                  )}
                  
                  {/* Enhanced Metadata */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {currentMedia.resolution && (
                      <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{currentMedia.resolution}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Resolution</div>
                      </div>
                    )}
                    {currentMedia.duration && (
                      <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{currentMedia.duration}s</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Duration</div>
                      </div>
                    )}
                    {currentMedia.photographer && (
                      <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{currentMedia.photographer}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Photographer</div>
                      </div>
                    )}
                    {currentMedia.location && (
                      <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{currentMedia.location}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Location</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {currentMedia.tags && currentMedia.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {currentMedia.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <Badge variant="outline" className="px-4 py-2 text-lg font-bold">
                    {current + 1} of {media.length}
                  </Badge>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredMedia.length} filtered
                  </div>
                </div>
              </div>
              
              {/* Enhanced Thumbnail Gallery */}
              {showThumbnails && (
                <div 
                  ref={thumbnailSwipeRef} 
                  className="touch-manipulation select-none"
                  style={{ touchAction: 'pan-x' }}
                >
                  <Separator className="mb-4" />
                  <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
                    {media.map((item, idx) => (
                      <motion.div
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`flex-shrink-0 w-32 h-20 cursor-pointer rounded-xl overflow-hidden border-2 transition-all relative group ${
                          current === idx 
                            ? 'border-toyota-red shadow-lg scale-105 ring-2 ring-toyota-red/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:scale-102'
                        } ${activeFilter !== 'all' && item.type !== activeFilter ? "opacity-40" : ""}`}
                        whileHover={{ scale: current === idx ? 1.05 : 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        layout
                      >
                        {item.type === "image" || item.type === "360" || item.type === "ar" || item.type === "interactive" ? (
                          <img src={item.url} alt={`Media ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-black relative">
                            {item.thumbnail ? (
                              <img src={item.thumbnail} alt={`Video ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            ) : (
                              <div className="bg-gray-800 w-full h-full" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                              <Play className="h-6 w-6 text-white drop-shadow-lg" />
                            </div>
                          </div>
                        )}
                        
                        {/* Enhanced Type Indicators */}
                        <div className="absolute top-2 right-2 flex space-x-1">
                          {item.isPremium && (
                            <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-sm ring-1 ring-white/50" />
                          )}
                          {item.type === 'video' && (
                            <div className="w-2 h-2 bg-red-500 rounded-full shadow-sm ring-1 ring-white/50" />
                          )}
                          {item.type === '360' && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full shadow-sm ring-1 ring-white/50" />
                          )}
                          {item.type === 'ar' && (
                            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-sm ring-1 ring-white/50" />
                          )}
                          {item.type === 'interactive' && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full shadow-sm ring-1 ring-white/50" />
                          )}
                        </div>
                        
                        {/* Selection Overlay */}
                        {current === idx && (
                          <motion.div 
                            className="absolute inset-0 bg-toyota-red/20 border-2 border-toyota-red rounded-xl"
                            layoutId="selection"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        
                        {/* Favorite Indicator */}
                        {favorites.includes(idx) && (
                          <div className="absolute top-2 left-2">
                            <Heart className="h-3 w-3 text-red-500 fill-current" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Mobile Swipe Indicator */}
                  <div className="flex flex-col items-center space-y-3 mt-6 md:hidden">
                    <div className="flex space-x-2">
                      {media.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === current ? 'bg-toyota-red w-6' : 'bg-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>Swipe to browse</span>
                      <ChevronLeft className="h-3 w-3" />
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Enhanced Fullscreen Modal */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Fullscreen Header */}
            <motion.div 
              className="flex justify-between items-center p-6 bg-black/80 backdrop-blur-xl border-b border-white/10"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-white">
                <h3 className="font-bold text-xl">{currentMedia.title}</h3>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-sm text-gray-300">{current + 1} of {media.length}</p>
                  {currentMedia.resolution && (
                    <Badge variant="outline" className="text-white border-white/20">
                      {currentMedia.resolution}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="bg-black/50 text-white border-white/20 hover:bg-black/70">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-black/50 text-white border-white/20 hover:bg-black/70">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-black/50 text-white border-white/20 hover:bg-black/70">
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-black/50 text-white border-white/20 hover:bg-black/70"
                  onClick={() => setFullscreen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
            
            {/* Fullscreen Content */}
            <div className="flex-1 flex items-center justify-center relative" onClick={() => setFullscreen(false)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="max-h-[80vh] max-w-full cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {currentMedia.type === "image" || currentMedia.type === "360" || currentMedia.type === "ar" || currentMedia.type === "interactive" ? (
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
            <motion.div 
              className="flex justify-between items-center p-6 bg-black/80 backdrop-blur-xl border-t border-white/10"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Button 
                variant="outline" 
                className="bg-black/50 text-white border-white/20 hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </Button>
              
              <div className="flex items-center space-x-4">
                <span className="text-white text-lg font-medium">
                  {current + 1} of {media.length}
                </span>
                <Progress value={(current + 1) / media.length * 100} className="w-32" />
              </div>
              
              <Button 
                variant="outline" 
                className="bg-black/50 text-white border-white/20 hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VehicleMediaShowcase;
