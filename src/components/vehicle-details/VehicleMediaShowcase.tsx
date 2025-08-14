import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Zap,
  Gauge,
  Settings,
  Shield,
  Cpu,
  Car,
  Navigation,
  Eye,
  Award,
  Sparkles,
  Info,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "@/hooks/use-swipeable";

interface MediaItem {
  id: string;
  type: "image" | "video" | "360";
  url: string;
  thumbnail?: string;
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  details: {
    specs?: string[];
    benefits?: string[];
    technology?: string[];
  };
  isPremium?: boolean;
  galleryImages?: {
    url: string;
    title: string;
    description: string;
  }[];
}

interface VehicleMediaShowcaseProps {
  vehicle: VehicleModel;
}

const VehicleMediaShowcase: React.FC<VehicleMediaShowcaseProps> = ({ vehicle }) => {
  const isMobile = useIsMobile();
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Enhanced media content with rich details and multiple images per item
  const mediaItems: MediaItem[] = [
    {
      id: "performance",
      type: "image",
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
      title: "V6 Twin-Turbo Engine",
      description: "Experience unmatched power and efficiency with our advanced twin-turbo technology",
      category: "Performance",
      icon: Zap,
      details: {
        specs: ["3.5L V6 Twin-Turbo", "400+ HP", "0-60 in 4.2s", "EPA 28 MPG"],
        benefits: ["Superior acceleration", "Fuel efficiency", "Reduced emissions"],
        technology: ["Direct injection", "Variable valve timing", "Turbo lag elimination"]
      },
      isPremium: true,
      galleryImages: [
        {
          url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
          title: "Engine Bay Overview",
          description: "Complete view of the V6 twin-turbo engine"
        },
        {
          url: "https://images.unsplash.com/photo-1619976215249-72c1eb36042e?auto=format&fit=crop&w=1200&q=80",
          title: "Turbocharger Detail",
          description: "Advanced twin-turbo technology up close"
        },
        {
          url: "https://images.unsplash.com/photo-1486650547751-9f3f9db50009?auto=format&fit=crop&w=1200&q=80",
          title: "Performance Specs",
          description: "Technical specifications and performance data"
        },
        {
          url: "https://images.unsplash.com/photo-1544829099-b9a0c5303bea?auto=format&fit=crop&w=1200&q=80",
          title: "Engine Control Unit",
          description: "Advanced ECU and engine management systems"
        }
      ]
    },
    {
      id: "interior",
      type: "image",
      url: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
      title: "Luxury Interior",
      description: "Premium materials and cutting-edge technology create an unparalleled driving experience",
      category: "Interior",
      icon: Car,
      details: {
        specs: ["Leather-appointed seats", "12.3\" display", "Premium audio", "Climate zones"],
        benefits: ["Ultimate comfort", "Intuitive controls", "Personalized experience"],
        technology: ["Heated/ventilated seats", "Wireless charging", "Voice recognition"]
      },
      galleryImages: [
        {
          url: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
          title: "Dashboard Overview",
          description: "Premium dashboard with digital displays"
        },
        {
          url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80",
          title: "Leather Seats",
          description: "Hand-crafted leather seating with premium stitching"
        },
        {
          url: "https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?auto=format&fit=crop&w=1200&q=80",
          title: "Center Console",
          description: "Ergonomic center console with premium materials"
        },
        {
          url: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
          title: "Rear Seating",
          description: "Spacious rear passenger compartment"
        }
      ]
    },
    {
      id: "safety",
      type: "video",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80",
      title: "Toyota Safety Sense",
      description: "Advanced safety systems that protect what matters most",
      category: "Safety",
      icon: Shield,
      details: {
        specs: ["Pre-collision system", "Lane assist", "Adaptive cruise", "Blind spot monitor"],
        benefits: ["Accident prevention", "Stress reduction", "Confident driving"],
        technology: ["Radar sensors", "Camera systems", "AI processing"]
      },
      isPremium: true
    },
    {
      id: "handling",
      type: "image",
      url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      title: "Dynamic Handling",
      description: "Precision engineering delivers exceptional road feel and control",
      category: "Performance",
      icon: Navigation,
      details: {
        specs: ["Adaptive suspension", "All-wheel drive", "Sport mode", "Electronic stability"],
        benefits: ["Superior grip", "Smooth ride", "Confident cornering"],
        technology: ["Active dampers", "Torque vectoring", "Drive mode selection"]
      }
    },
    {
      id: "tech",
      type: "360",
      url: "https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=1200&q=80",
      title: "Connected Technology",
      description: "Stay connected with intelligent features that enhance every journey",
      category: "Technology",
      icon: Cpu,
      details: {
        specs: ["Apple CarPlay", "Android Auto", "WiFi hotspot", "OTA updates"],
        benefits: ["Seamless integration", "Always updated", "Enhanced convenience"],
        technology: ["5G connectivity", "Cloud services", "AI assistant"]
      }
    }
  ];

  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => setCurrentIndex(prev => Math.min(prev + 1, mediaItems.length - 1)),
    onSwipeRight: () => setCurrentIndex(prev => Math.max(prev - 1, 0)),
    threshold: 50
  });

  const handleMediaClick = (media: MediaItem) => {
    setSelectedMedia(media);
  };

  const closeModal = () => {
    setSelectedMedia(null);
    setIsPlaying(false);
  };

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

  const nextModalImage = () => {
    if (selectedMedia?.galleryImages) {
      setModalImageIndex(prev => (prev + 1) % selectedMedia.galleryImages!.length);
    }
  };

  const prevModalImage = () => {
    if (selectedMedia?.galleryImages) {
      setModalImageIndex(prev => (prev - 1 + selectedMedia.galleryImages!.length) % selectedMedia.galleryImages!.length);
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-background to-muted/30">
      {/* Hero Header */}
      <div className="text-center py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Badge variant="outline" className="px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            Explore Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {vehicle.name} Highlights
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the advanced technologies and premium features that make every drive exceptional
          </p>
        </motion.div>
      </div>

      {/* Interactive Feature Grid */}
      <div className="px-4 md:px-8 pb-8">
        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div ref={swipeableRef} className="relative">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full"
            >
              <MediaCard 
                media={mediaItems[currentIndex]} 
                onClick={() => handleMediaClick(mediaItems[currentIndex])}
                isMobile={true}
              />
            </motion.div>
            
            {/* Mobile Navigation */}
            <div className="flex justify-center mt-6 space-x-2">
              {mediaItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex ? 'bg-primary scale-125' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((media, index) => (
            <motion.div
              key={media.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MediaCard 
                media={media} 
                onClick={() => handleMediaClick(media)}
                isMobile={false}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Detailed Modal with Image Gallery */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-2xl font-bold">{selectedMedia.title}</h3>
                  <p className="text-muted-foreground">{selectedMedia.category}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeModal}
                  className="hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 max-h-[calc(95vh-80px)]">
                {/* Image Gallery Section */}
                <div className="relative">
                  {/* Main Image Display */}
                  <div className="relative h-64 md:h-96 bg-muted">
                    {selectedMedia.galleryImages && selectedMedia.galleryImages[modalImageIndex] && (
                      <img
                        src={selectedMedia.galleryImages[modalImageIndex].url}
                        alt={selectedMedia.galleryImages[modalImageIndex].title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {/* Navigation Arrows */}
                    {selectedMedia.galleryImages && selectedMedia.galleryImages.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={prevModalImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={nextModalImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {modalImageIndex + 1} / {selectedMedia.galleryImages?.length || 1}
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  {selectedMedia.galleryImages && selectedMedia.galleryImages.length > 1 && (
                    <div className="p-4 bg-muted/30">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedMedia.galleryImages.map((img, index) => (
                          <button
                            key={index}
                            onClick={() => setModalImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                              index === modalImageIndex ? 'border-primary' : 'border-transparent hover:border-primary/50'
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={img.title}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Current Image Info */}
                  {selectedMedia.galleryImages && selectedMedia.galleryImages[modalImageIndex] && (
                    <div className="p-4 border-t">
                      <h4 className="font-semibold mb-1">
                        {selectedMedia.galleryImages[modalImageIndex].title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedMedia.galleryImages[modalImageIndex].description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {selectedMedia.description}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                      {selectedMedia.details.specs && (
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center">
                            <Gauge className="h-4 w-4 mr-2" />
                            Specifications
                          </h4>
                          <ul className="space-y-2">
                            {selectedMedia.details.specs.map((spec, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-center">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                                {spec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedMedia.details.benefits && (
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center">
                            <Award className="h-4 w-4 mr-2" />
                            Key Benefits
                          </h4>
                          <ul className="space-y-2">
                            {selectedMedia.details.benefits.map((benefit, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-center">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedMedia.details.technology && (
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center">
                            <Cpu className="h-4 w-4 mr-2" />
                            Technology
                          </h4>
                          <ul className="space-y-2">
                            {selectedMedia.details.technology.map((tech, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-center">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                                {tech}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Additional Content Section */}
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="text-lg font-semibold">Why Choose This Feature?</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Enhanced Performance</p>
                            <p className="text-sm text-muted-foreground">Optimized for maximum efficiency and power delivery</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Advanced Technology</p>
                            <p className="text-sm text-muted-foreground">Latest innovations for superior driving experience</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Premium Quality</p>
                            <p className="text-sm text-muted-foreground">Built with the finest materials and craftsmanship</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Media Card Component
interface MediaCardProps {
  media: MediaItem;
  onClick: () => void;
  isMobile: boolean;
}

const MediaCard: React.FC<MediaCardProps> = ({ media, onClick, isMobile }) => {
  return (
    <motion.div
      whileHover={{ scale: isMobile ? 1 : 1.02, y: isMobile ? 0 : -5 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-muted/20 hover:shadow-2xl transition-all duration-300">
        <div className="relative">
          {/* Media Preview */}
          <div className="relative h-48 md:h-56 overflow-hidden">
            <img 
              src={media.url} 
              alt={media.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Type Indicator */}
            <div className="absolute top-3 right-3">
              {media.type === "video" && (
                <Badge className="bg-red-500/90 text-white">
                  <Play className="h-3 w-3 mr-1" />
                  Video
                </Badge>
              )}
              {media.type === "360" && (
                <Badge className="bg-purple-500/90 text-white">
                  <Eye className="h-3 w-3 mr-1" />
                  360°
                </Badge>
              )}
            </div>

            {/* Icon & Premium Badge */}
            <div className="absolute top-3 left-3 flex items-center space-x-2">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                <media.icon className="h-4 w-4 text-white" />
              </div>
              {media.isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs">
                  Premium
                </Badge>
              )}
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Badge variant="secondary" className="mb-2 text-xs">
                {media.category}
              </Badge>
              <h3 className="text-white font-bold text-lg md:text-xl mb-1">
                {media.title}
              </h3>
              <p className="text-white/80 text-sm line-clamp-2">
                {media.description}
              </p>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-primary/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Info className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default VehicleMediaShowcase;
