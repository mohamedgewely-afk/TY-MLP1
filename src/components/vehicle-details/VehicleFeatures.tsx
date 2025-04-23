
import React from "react";
import { VehicleModel } from "@/types/vehicle";
import { 
  Fuel, Shield, Settings, Eye, 
  BookOpen, GalleryVertical 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface VehicleFeaturesProps {
  vehicle: VehicleModel;
}

const VehicleFeatures: React.FC<VehicleFeaturesProps> = ({ vehicle }) => {
  // Enhanced feature categories with images
  const featureCategories = [
    {
      title: "Performance",
      description: "Experience power and efficiency in perfect harmony",
      icon: <Settings className="h-6 w-6" />,
      image: "https://global.toyota/pages/models/images/gallery/new_camry_23/performance/performance_01_800x447.jpg",
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
      image: "https://global.toyota/pages/news/images/2021/07/15/1330/20210715_01_15_s.jpg",
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
      image: "https://global.toyota/pages/news/images/2021/07/15/1330/20210715_01_11_s.jpg",
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
      image: "https://www.toyota.com/imgix/content/dam/toyota/jellies/max/2023/camry/xse/2532/2pt/33/61.png?fm=png&w=930&q=90",
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
      image: "https://global.toyota/pages/models/images/gallery/new_camry_hybrid_23/design/design_03_800x447.jpg",
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
      image: "https://global.toyota/pages/news/images/2021/07/15/1330/20210715_01_05_s.jpg",
      features: [
        "3-year/36,000-mile basic coverage",
        "5-year/60,000-mile powertrain coverage",
        "10-year/150,000-mile hybrid battery warranty (Hybrid models)",
        "2-year/unlimited-mile ToyotaCare maintenance plan",
        "Roadside assistance"
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
        Features & Highlights
      </h2>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {featureCategories.map((category, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <div className="flex items-center mb-1">
                      <div className="bg-toyota-red p-2 rounded-full mr-3">
                        {category.icon}
                      </div>
                      <h3 className="text-xl font-bold">{category.title}</h3>
                    </div>
                    <p className="text-sm text-white/80">{category.description}</p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <ul className="space-y-2">
                  {category.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default VehicleFeatures;
