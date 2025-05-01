
import React, { useState } from "react";
import { VehicleModel } from "@/types/vehicle";
import { 
  Fuel, Shield, Settings, Eye, 
  BookOpen, GalleryVertical, ChevronLeft, ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";

interface VehicleFeaturesProps {
  vehicle: VehicleModel;
}

const VehicleFeatures: React.FC<VehicleFeaturesProps> = ({ vehicle }) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{url: string, type: string, thumbnail?: string}>({
    url: "", type: "image"
  });

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

  return (
    <>
      {/* Featured Media Carousel - Large Format */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Features & Highlights
        </h2>
        
        <div className="bg-black rounded-xl overflow-hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {featureCategories[selectedCategory].media.map((media, idx) => (
                <CarouselItem key={idx} className="relative">
                  <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                    {media.type === "image" ? (
                      <img 
                        src={media.url} 
                        alt={featureCategories[selectedCategory].title} 
                        className="w-full h-full object-cover"
                        onClick={() => handleOpenMedia(media)}
                      />
                    ) : (
                      <video
                        src={media.url}
                        poster={media.thumbnail}
                        controls
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-xl md:text-3xl font-bold text-white mb-2">
                        {featureCategories[selectedCategory].title}
                      </h3>
                      <p className="text-white/80 mb-4 max-w-2xl">
                        {featureCategories[selectedCategory].description}
                      </p>
                    </motion.div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute z-10 inset-y-0 left-0 flex items-center">
              <CarouselPrevious className="ml-4 bg-black/30 hover:bg-black/60 border-none text-white" />
            </div>
            <div className="absolute z-10 inset-y-0 right-0 flex items-center">
              <CarouselNext className="mr-4 bg-black/30 hover:bg-black/60 border-none text-white" />
            </div>
          </Carousel>
          
          {/* Category Selector */}
          <div className="bg-gray-900 p-4">
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {featureCategories.map((category, idx) => (
                <Button
                  key={idx}
                  variant={selectedCategory === idx ? "default" : "outline"}
                  className={`rounded-full whitespace-nowrap transition-all ${selectedCategory === idx ? 'bg-toyota-red hover:bg-toyota-darkred' : 'bg-transparent text-white hover:text-white'}`}
                  onClick={() => setSelectedCategory(idx)}
                >
                  <span className="flex items-center">
                    <span className="mr-2">{category.icon}</span>
                    {category.title}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
          Detailed Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featureCategories.map((category, idx) => (
            <Card key={idx} className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-40 relative overflow-hidden cursor-pointer" onClick={() => setSelectedCategory(idx)}>
                <Carousel opts={{ align: "start", loop: true }}>
                  <CarouselContent>
                    {category.media.map((m, i) => (
                      <CarouselItem key={i}>
                        {m.type === "image" ? (
                          <img src={m.url} alt={category.title} className="w-full h-40 object-cover" />
                        ) : (
                          <div className="relative w-full h-40 bg-gray-200">
                            <img 
                              src={m.thumbnail || ''} 
                              alt={category.title} 
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
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center">
                      <div className="bg-toyota-red p-2 rounded-full mr-3">
                        {category.icon}
                      </div>
                      <h3 className="text-lg font-bold text-white">{category.title}</h3>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4 bg-white dark:bg-gray-900">
                <ul className="space-y-2">
                  {category.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 mr-2 mt-0.5 bg-toyota-red/10 rounded-full text-toyota-red">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
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
