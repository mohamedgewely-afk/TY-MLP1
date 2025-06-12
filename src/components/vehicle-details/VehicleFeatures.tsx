
import React, { useState } from "react";
import { VehicleModel } from "@/types/vehicle";
import { 
  Fuel, Shield, Settings, Eye, 
  BookOpen, GalleryVertical, ChevronLeft, ChevronRight, X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface VehicleFeaturesProps {
  vehicle: VehicleModel;
}

const VehicleFeatures: React.FC<VehicleFeaturesProps> = ({ vehicle }) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{url: string, type: string, thumbnail?: string}>({
    url: "", type: "image"
  });
  const isMobile = useIsMobile();

  // Enhanced feature categories with media
  const featureCategories = [
    {
      title: "Performance",
      description: "Experience power and efficiency in perfect harmony",
      icon: <Settings className="h-6 w-6" />,
      media: [
        { type: "image", url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80" },
        { type: "image", url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80" },
        { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://images.unsplash.com/photo-1507228941675-c39b4a8ab3f3?auto=format&fit=crop&w=800&q=80" }
      ],
      features: [
        "Dynamic Force Engine with enhanced performance",
        "Sport-tuned suspension for responsive handling",
        "Continuously Variable Transmission with paddle shifters",
        "Drive Mode Select with ECO, Normal and Sport modes",
        "Available AWD system for enhanced traction"
      ]
    },
    {
      title: "Safety",
      description: "Toyota Safety Sense™ 2.5+ advanced safety suite",
      icon: <Shield className="h-6 w-6" />,
      media: [
        { type: "image", url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80" },
        { type: "image", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80" }
      ],
      features: [
        "Pre-Collision System with Pedestrian Detection",
        "Full-Speed Range Dynamic Radar Cruise Control",
        "Lane Departure Alert with Steering Assist",
        "Automatic High Beams",
        "Road Sign Assist"
      ]
    },
    {
      title: "Comfort",
      description: "Premium features for a first-class driving experience",
      icon: <GalleryVertical className="h-6 w-6" />,
      media: [
        { type: "image", url: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80" },
        { type: "image", url: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80" }
      ],
      features: [
        "Leather-trimmed heated and ventilated front seats",
        "Panoramic glass roof with power sunshade",
        "Dual-zone automatic climate control",
        "Premium JBL® sound system with 9 speakers",
        "Wireless smartphone charging"
      ]
    },
    {
      title: "Technology",
      description: "Connected features for the modern driver",
      icon: <Eye className="h-6 w-6" />,
      media: [
        { type: "image", url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80" },
        { type: "video", url: "https://www.w3schools.com/html/movie.mp4", thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80" }
      ],
      features: [
        "9-inch touchscreen infotainment system",
        "Apple CarPlay® and Android Auto™ compatibility",
        "Amazon Alexa connectivity",
        "SiriusXM® Satellite Radio capability",
        "Toyota Remote Connect with smartwatch compatibility"
      ]
    },
    {
      title: "Fuel Economy",
      description: "Efficient performance that saves you money",
      icon: <Fuel className="h-6 w-6" />,
      media: [
        { type: "image", url: "https://images.unsplash.com/photo-1558618644-fcd25c85cd64?auto=format&fit=crop&w=800&q=80" },
        { type: "image", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80" }
      ],
      features: [
        "Up to 51 MPG city / 53 MPG highway (Hybrid LE)",
        "28 MPG city / 39 MPG highway (2.5L engine)",
        "ECO driving mode for maximized efficiency",
        "Regenerative braking system (Hybrid models)",
        "Real-time fuel economy display"
      ]
    },
    {
      title: "Warranty",
      description: "Comprehensive coverage for your peace of mind",
      icon: <BookOpen className="h-6 w-6" />,
      media: [
        { type: "image", url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80" },
        { type: "image", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" }
      ],
      features: [
        "3-year/36,000-mile basic coverage",
        "5-year/60,000-mile powertrain coverage",
        "10-year/150,000-mile hybrid battery warranty (Hybrid models)",
        "2-year/unlimited-mile ToyotaCare maintenance plan",
        "Roadside assistance"
      ]
    }
  ];

  const handleOpenMedia = (media: {url: string, type: string, thumbnail?: string}) => {
    setSelectedMedia(media);
    setOpenMediaDialog(true);
  };

  const nextCategory = () => {
    setSelectedCategory((prev) => (prev + 1) % featureCategories.length);
  };

  const prevCategory = () => {
    setSelectedCategory((prev) => (prev - 1 + featureCategories.length) % featureCategories.length);
  };

  return (
    <>
      {/* Features Section - Swipeable Cards */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-foreground px-4">
          Vehicle Features
        </h2>
        
        {/* Mobile Swipeable View */}
        {isMobile ? (
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide px-4">
              <div className="flex space-x-4 pb-4" style={{ width: `${featureCategories.length * 320}px` }}>
                {featureCategories.map((category, idx) => (
                  <motion.div
                    key={idx}
                    className="flex-shrink-0 w-80"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card border-border">
                      <div className="h-48 relative overflow-hidden">
                        <img 
                          src={category.media[0].url} 
                          alt={category.title} 
                          className="w-full h-full object-cover"
                          onClick={() => handleOpenMedia(category.media[0])}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center">
                              <div className="bg-toyota-red p-2 rounded-full mr-3">
                                {category.icon}
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-white">{category.title}</h3>
                                <p className="text-white/80 text-sm">{category.description}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className="p-4 bg-card">
                        <ul className="space-y-2">
                          {category.features.slice(0, 3).map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <span className="inline-flex items-center justify-center flex-shrink-0 w-4 h-4 mr-2 mt-0.5 bg-toyota-red/10 rounded-full text-toyota-red">
                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </span>
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                          {category.features.length > 3 && (
                            <li className="text-sm text-toyota-red font-medium">
                              +{category.features.length - 3} more features
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="flex justify-center mt-4 space-x-1">
              {featureCategories.map((_, idx) => (
                <div
                  key={idx}
                  className="w-2 h-2 rounded-full bg-muted transition-colors"
                />
              ))}
            </div>
          </div>
        ) : (
          /* Desktop Grid View with Navigation */
          <div className="px-4">
            <div className="relative">
              {/* Navigation Arrows */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevCategory}
                  className="rounded-full bg-background/80 backdrop-blur-md border-border hover:bg-background"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextCategory}
                  className="rounded-full bg-background/80 backdrop-blur-md border-border hover:bg-background"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-12">
                {featureCategories.map((category, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card border-border">
                      <div className="h-48 relative overflow-hidden cursor-pointer" onClick={() => handleOpenMedia(category.media[0])}>
                        <img 
                          src={category.media[0].url} 
                          alt={category.title} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center">
                              <div className="bg-toyota-red p-2 rounded-full mr-3">
                                {category.icon}
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-white">{category.title}</h3>
                                <p className="text-white/80 text-sm">{category.description}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className="p-4 bg-card">
                        <ul className="space-y-2">
                          {category.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <span className="inline-flex items-center justify-center flex-shrink-0 w-4 h-4 mr-2 mt-0.5 bg-toyota-red/10 rounded-full text-toyota-red">
                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </span>
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Media Dialog */}
      <Dialog open={openMediaDialog} onOpenChange={setOpenMediaDialog}>
        <DialogContent className="max-w-5xl p-0 bg-black border-none">
          <div className="relative">
            <Button 
              variant="outline" 
              className="absolute top-4 right-4 z-10 bg-black/50 text-white border-none hover:bg-black/70"
              onClick={() => setOpenMediaDialog(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            {selectedMedia.type === "image" ? (
              <img 
                src={selectedMedia.url}
                alt="Feature showcase"
                className="w-full max-h-[80vh] object-contain"
              />
            ) : (
              <video 
                src={selectedMedia.url}
                poster={selectedMedia.thumbnail}
                controls
                autoPlay
                className="w-full max-h-[80vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VehicleFeatures;
