
import React, { useState } from "react";
import { VehicleModel } from "@/types/vehicle";
import { 
  Fuel, Shield, Settings, Eye, 
  BookOpen, GalleryVertical, ChevronLeft, ChevronRight, X, Zap, Leaf
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface VehicleFeaturesProps {
  vehicle: VehicleModel;
}

const VehicleFeatures: React.FC<VehicleFeaturesProps> = ({ vehicle }) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{url: string, type: string, thumbnail?: string}>({
    url: "", type: "image"
  });

  // Enhanced feature categories with premium styling and better media
  const featureCategories = [
    {
      title: "Hybrid Performance",
      description: "Experience the perfect harmony of power and efficiency with Toyota's advanced hybrid technology",
      icon: <Zap className="h-6 w-6" />,
      gradient: "from-emerald-500 to-teal-500",
      badge: "25.2 km/L",
      media: [
        { type: "image", url: "https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg" },
        { type: "image", url: "https://global.toyota/pages/models/images/gallery/new_camry_23/performance/performance_01_800x447.jpg" },
        { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg" }
      ],
      features: [
        "Advanced Hybrid Synergy Drive with instant electric torque",
        "Intelligent All-Wheel Drive with dynamic torque distribution",
        "Electronically Controlled CVT with 10-speed manual mode",
        "Multiple drive modes: EV, Eco, Normal, Sport, and Custom",
        "Regenerative braking system for maximum energy recovery"
      ]
    },
    {
      title: "Advanced Safety Systems",
      description: "Toyota Safety Sense™ 3.0 with AI-powered protection and collision prevention technology",
      icon: <Shield className="h-6 w-6" />,
      gradient: "from-blue-500 to-cyan-500",
      badge: "5-Star NCAP",
      media: [
        { type: "image", url: "https://images.pexels.com/photos/97079/pexels-photo-97079.jpeg" },
        { type: "image", url: "https://global.toyota/pages/news/images/2021/07/15/1330/20210715_01_15_s.jpg" }
      ],
      features: [
        "Pre-Collision System with Pedestrian & Cyclist Detection",
        "Dynamic Radar Cruise Control with full-speed range capability",
        "Lane Departure Alert with intelligent steering assistance",
        "Automatic High Beams with adaptive LED matrix technology",
        "Blind Spot Monitor with Rear Cross-Traffic Alert"
      ]
    },
    {
      title: "Premium Comfort & Luxury",
      description: "Meticulously crafted interior featuring premium materials and advanced comfort technologies",
      icon: <GalleryVertical className="h-6 w-6" />,
      gradient: "from-purple-500 to-pink-500",
      badge: "Premium",
      media: [
        { type: "image", url: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg" },
        { type: "image", url: "https://global.toyota/pages/news/images/2021/07/15/1330/20210715_01_11_s.jpg" }
      ],
      features: [
        "Premium leather-appointed seating with 8-way power adjustment",
        "Heated and ventilated front seats with memory function",
        "Panoramic glass roof with power tilt/slide sunshade",
        "Tri-zone automatic climate control with air purification",
        "Ambient lighting with 7-color customization"
      ]
    },
    {
      title: "Connected Technology",
      description: "Stay seamlessly connected with Toyota's most advanced infotainment and connectivity suite",
      icon: <Eye className="h-6 w-6" />,
      gradient: "from-orange-500 to-red-500",
      badge: "Latest Tech",
      media: [
        { type: "image", url: "https://images.pexels.com/photos/193993/pexels-photo-193993.jpeg" },
        { type: "video", url: "https://www.w3schools.com/html/movie.mp4", thumbnail: "https://www.toyota.com/imgix/content/dam/toyota/jellies/max/2023/camry/xse/2532/2pt/33/61.png?fm=png&w=930&q=90" }
      ],
      features: [
        "12.3-inch HD multimedia display with intuitive touch controls",
        "Wireless Apple CarPlay® and Android Auto™ integration",
        "Premium JBL® audio system with 9 speakers and subwoofer",
        "Qi wireless charging pad with device cooling ventilation",
        "Toyota Connected Services with remote vehicle management"
      ]
    },
    {
      title: "Exceptional Efficiency",
      description: "Industry-leading fuel economy that saves money while reducing environmental impact",
      icon: <Leaf className="h-6 w-6" />,
      gradient: "from-green-500 to-emerald-500",
      badge: "Eco Leader",
      media: [
        { type: "image", url: "https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg" },
        { type: "image", url: "https://global.toyota/pages/models/images/gallery/new_camry_hybrid_23/design/design_03_800x447.jpg" }
      ],
      features: [
        "Outstanding 25.2 km/L combined fuel efficiency rating",
        "Ultra-low emissions with advanced catalytic converter",
        "Eco-driving modes for maximized efficiency optimization",
        "Real-time energy flow display with coaching feedback",
        "Extended driving range up to 900km on a single tank"
      ]
    },
    {
      title: "Peace of Mind Warranty",
      description: "Comprehensive coverage and maintenance programs for complete ownership confidence",
      icon: <BookOpen className="h-6 w-6" />,
      gradient: "from-gray-600 to-slate-600",
      badge: "Protected",
      media: [
        { type: "image", url: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg" },
        { type: "image", url: "https://global.toyota/pages/news/images/2021/07/15/1330/20210715_01_05_s.jpg" }
      ],
      features: [
        "5-year/100,000km comprehensive vehicle warranty",
        "8-year/160,000km hybrid battery warranty coverage",
        "3-year/60,000km complimentary maintenance program",
        "24/7 roadside assistance with emergency support",
        "Toyota Genuine Parts guarantee for optimal performance"
      ]
    }
  ];

  const handleOpenMedia = (media: {url: string, type: string, thumbnail?: string}) => {
    setSelectedMedia(media);
    setOpenMediaDialog(true);
  };

  const nextCategory = () => {
    setSelectedCategory(prev => (prev + 1) % featureCategories.length);
  };

  const prevCategory = () => {
    setSelectedCategory(prev => (prev - 1 + featureCategories.length) % featureCategories.length);
  };

  // Premium easing curve
  const premiumEasing = [0.25, 0.1, 0.25, 1];

  return (
    <>
      {/* Enhanced Features Section */}
      <div className="bg-card rounded-3xl shadow-2xl overflow-hidden border border-border/30">
        <div className="p-8 pb-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: premiumEasing }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Premium Vehicle Features
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Explore the advanced technologies and premium features that make the {vehicle.name} exceptional.
            </p>
          </motion.div>
        </div>

        {/* Enhanced Swipeable Feature Cards */}
        <div className="relative">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4, ease: premiumEasing }}
                className="p-8"
              >
                <Card className="h-full overflow-hidden border-none shadow-xl">
                  {/* Enhanced Media Section */}
                  <div className="h-64 md:h-80 relative overflow-hidden group">
                    <div className="flex transition-transform duration-300">
                      {featureCategories[selectedCategory].media.map((m, i) => (
                        <div key={i} className="w-full flex-shrink-0 relative cursor-pointer" onClick={() => handleOpenMedia(m)}>
                          {m.type === "image" ? (
                            <img 
                              src={m.url} 
                              alt={featureCategories[selectedCategory].title} 
                              className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="relative w-full h-64 md:h-80 bg-muted">
                              <img 
                                src={m.thumbnail || ''} 
                                alt={featureCategories[selectedCategory].title} 
                                className="w-full h-full object-cover opacity-80"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-primary/90 rounded-full p-4 shadow-2xl hover:scale-110 transition-transform duration-300">
                                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 5V19L19 12L8 5Z" fill="white" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Enhanced Overlay with Premium Design */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className={`bg-gradient-to-br ${featureCategories[selectedCategory].gradient} p-4 rounded-2xl mr-4 shadow-xl`}>
                              {featureCategories[selectedCategory].icon}
                            </div>
                            <div>
                              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                                {featureCategories[selectedCategory].title}
                              </h3>
                              <p className="text-white/90 text-base md:text-lg leading-relaxed">
                                {featureCategories[selectedCategory].description}
                              </p>
                            </div>
                          </div>
                          
                          {/* Premium Badge */}
                          <div className={`bg-gradient-to-r ${featureCategories[selectedCategory].gradient} text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl`}>
                            {featureCategories[selectedCategory].badge}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Features List */}
                  <CardContent className="p-8 bg-gradient-to-br from-background to-muted/30">
                    <ul className="space-y-4">
                      {featureCategories[selectedCategory].features.map((feature, i) => (
                        <motion.li 
                          key={i} 
                          className="flex items-start group"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.4, ease: premiumEasing }}
                        >
                          <span className={`inline-flex items-center justify-center flex-shrink-0 w-6 h-6 mr-4 mt-1 bg-gradient-to-r ${featureCategories[selectedCategory].gradient} rounded-full text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                          <span className="text-foreground leading-relaxed font-medium text-base group-hover:text-primary transition-colors duration-300">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Enhanced Navigation Arrows */}
          <Button
            onClick={prevCategory}
            variant="outline"
            className={`absolute left-6 top-1/2 transform -translate-y-1/2 z-10 p-4 rounded-full bg-background/95 shadow-xl border-2 hover:scale-110 transition-all duration-300 ${
              selectedCategory === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl hover:border-primary'
            }`}
            disabled={selectedCategory === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            onClick={nextCategory}
            variant="outline"
            className={`absolute right-6 top-1/2 transform -translate-y-1/2 z-10 p-4 rounded-full bg-background/95 shadow-xl border-2 hover:scale-110 transition-all duration-300 ${
              selectedCategory === featureCategories.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl hover:border-primary'
            }`}
            disabled={selectedCategory === featureCategories.length - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Enhanced Category Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {featureCategories.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === selectedCategory 
                    ? "bg-primary w-8 h-3 shadow-lg" 
                    : "bg-white/40 w-3 h-3 hover:bg-white/60 hover:scale-125"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Enhanced Media Dialog */}
      <Dialog open={openMediaDialog} onOpenChange={setOpenMediaDialog}>
        <DialogContent className="max-w-6xl p-0 bg-black border-none rounded-2xl overflow-hidden">
          <div className="relative">
            <Button 
              variant="outline" 
              className="absolute top-6 right-6 z-10 bg-black/50 text-white border-none hover:bg-black/70 rounded-full p-3"
              onClick={() => setOpenMediaDialog(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            
            {selectedMedia.type === "image" ? (
              <img 
                src={selectedMedia.url}
                alt="Feature showcase"
                className="w-full max-h-[85vh] object-contain"
              />
            ) : (
              <video 
                src={selectedMedia.url}
                poster={selectedMedia.thumbnail}
                controls
                autoPlay
                className="w-full max-h-[85vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VehicleFeatures;
