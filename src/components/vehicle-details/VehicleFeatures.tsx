
import React, { useState } from "react";
import { VehicleModel } from "@/types/vehicle";
import { 
  Fuel, Shield, Settings, Eye, 
  BookOpen, GalleryVertical, ChevronLeft, ChevronRight, X
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
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Enhanced feature categories with media
  const featureCategories = [
    {
      title: "Performance",
      description: "Experience power and efficiency in perfect harmony",
      icon: <Settings className="h-6 w-6" />,
      media: [
        { type: "image", url: "https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg" },
        { type: "image", url: "https://global.toyota/pages/models/images/gallery/new_camry_23/performance/performance_01_800x447.jpg" },
        { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg" }
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
        { type: "image", url: "https://images.pexels.com/photos/97079/pexels-photo-97079.jpeg" },
        { type: "image", url: "https://global.toyota/pages/news/images/2021/07/15/1330/20210715_01_15_s.jpg" }
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
        { type: "image", url: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg" },
        { type: "image", url: "https://global.toyota/pages/news/images/2021/07/15/1330/20210715_01_11_s.jpg" }
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
        { type: "image", url: "https://images.pexels.com/photos/193993/pexels-photo-193993.jpeg" },
        { type: "video", url: "https://www.w3schools.com/html/movie.mp4", thumbnail: "https://www.toyota.com/imgix/content/dam/toyota/jellies/max/2023/camry/xse/2532/2pt/33/61.png?fm=png&w=930&q=90" }
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
        { type: "image", url: "https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg" },
        { type: "image", url: "https://global.toyota/pages/models/images/gallery/new_camry_hybrid_23/design/design_03_800x447.jpg" }
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
        { type: "image", url: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg" },
        { type: "image", url: "https://global.toyota/pages/news/images/2021/07/15/1330/20210715_01_05_s.jpg" }
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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && selectedCategory < featureCategories.length - 1) {
      setSelectedCategory(prev => prev + 1);
    }
    if (isRightSwipe && selectedCategory > 0) {
      setSelectedCategory(prev => prev - 1);
    }
  };

  const nextCategory = () => {
    if (selectedCategory < featureCategories.length - 1) {
      setSelectedCategory(prev => prev + 1);
    }
  };

  const prevCategory = () => {
    if (selectedCategory > 0) {
      setSelectedCategory(prev => prev - 1);
    }
  };

  return (
    <>
      {/* Single Features Section - Swipeable */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 pb-0">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Vehicle Features
          </h2>
        </div>

        {/* Swipeable Feature Cards */}
        <div className="relative">
          <div 
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="p-6"
              >
                <Card className="h-full overflow-hidden">
                  {/* Media Section */}
                  <div className="h-48 relative overflow-hidden">
                    <div className="flex transition-transform duration-300">
                      {featureCategories[selectedCategory].media.map((m, i) => (
                        <div key={i} className="w-full flex-shrink-0 relative">
                          {m.type === "image" ? (
                            <img 
                              src={m.url} 
                              alt={featureCategories[selectedCategory].title} 
                              className="w-full h-48 object-cover cursor-pointer"
                              onClick={() => handleOpenMedia(m)}
                            />
                          ) : (
                            <div className="relative w-full h-48 bg-gray-200 cursor-pointer" onClick={() => handleOpenMedia(m)}>
                              <img 
                                src={m.thumbnail || ''} 
                                alt={featureCategories[selectedCategory].title} 
                                className="w-full h-full object-cover opacity-60"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-toyota-red rounded-full p-3 bg-opacity-80">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 5V19L19 12L8 5Z" fill="white" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center">
                          <div className="bg-toyota-red p-2 rounded-full mr-3">
                            {featureCategories[selectedCategory].icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{featureCategories[selectedCategory].title}</h3>
                            <p className="text-white/80 text-sm">{featureCategories[selectedCategory].description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Features List */}
                  <CardContent className="p-6 bg-white dark:bg-gray-900">
                    <ul className="space-y-3">
                      {featureCategories[selectedCategory].features.map((feature, i) => (
                        <motion.li 
                          key={i} 
                          className="flex items-start"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 mr-3 mt-0.5 bg-toyota-red/10 rounded-full text-toyota-red">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevCategory}
            disabled={selectedCategory === 0}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 shadow-lg border border-gray-200 transition-all ${
              selectedCategory === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:shadow-xl'
            }`}
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>

          <button
            onClick={nextCategory}
            disabled={selectedCategory === featureCategories.length - 1}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 shadow-lg border border-gray-200 transition-all ${
              selectedCategory === featureCategories.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:shadow-xl'
            }`}
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2 p-4">
            {featureCategories.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  selectedCategory === idx ? 'bg-toyota-red scale-125' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
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
