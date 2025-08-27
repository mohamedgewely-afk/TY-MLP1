
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Smartphone, 
  Car,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLazyContent } from "@/hooks/use-lazy-content";
import FeatureCategory from "./FeatureCategory";
import SimpleFeatureModal from "./modals/SimpleFeatureModal";

interface VehicleMediaShowcaseProps {
  vehicle: VehicleModel;
}

interface FeatureCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  image: string;
  highlights: string[];
  benefits: string[];
  isPremium?: boolean;
  details: Array<{
    title: string;
    description: string;
    image: string;
    specs: string[];
    benefits: string[];
  }>;
}

const VehicleMediaShowcase: React.FC<VehicleMediaShowcaseProps> = ({ vehicle }) => {
  const isMobile = useIsMobile();
  const { elementRef, isVisible } = useLazyContent({ threshold: 0.1 });
  const [selectedCategory, setSelectedCategory] = useState<FeatureCategory | null>(null);

  // Simplified, focused feature categories
  const featureCategories: FeatureCategory[] = [
    {
      id: "performance",
      title: "Hybrid Performance",
      description: "Exceptional power meets outstanding efficiency",
      icon: Zap,
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/a2c5b39d-f2db-4f00-968c-e78f73a73652/renditions/4a3588b7-55f0-48f5-98dc-a219f5bfbaad?binary=true&mformat=true",
      highlights: ["2.5L Hybrid Engine", "208 Total HP", "52 MPG City", "All-Weather Capable"],
      benefits: ["Fuel Savings", "Instant Torque", "Eco-Friendly"],
      isPremium: true,
      details: [
        {
          title: "Hybrid Powertrain",
          description: "Advanced hybrid system combining gasoline engine with electric motor for optimal performance and efficiency.",
          image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
          specs: ["2.5L 4-cylinder engine", "Electric motor assistance", "eCVT transmission", "208 combined horsepower"],
          benefits: ["Exceptional fuel economy", "Reduced emissions", "Smooth acceleration"]
        },
        {
          title: "Fuel Efficiency",
          description: "Industry-leading fuel economy without compromising on performance or driving enjoyment.",
          image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0518d633-0b79-4964-97b1-daff0c8d5bf3/renditions/75f7f2ee-7e9b-4277-82ad-ca0126042c8c?binary=true&mformat=true",
          specs: ["52 MPG city", "53 MPG highway", "600+ mile range", "11.4-gallon tank"],
          benefits: ["Lower fuel costs", "Fewer gas stops", "Environmental impact"]
        }
      ]
    },
    {
      id: "safety",
      title: "Toyota Safety Sense",
      description: "Advanced safety systems that protect what matters most",
      icon: Shield,
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce8d5bf3/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
      highlights: ["Pre-Collision System", "Lane Departure Alert", "Dynamic Radar Cruise", "Automatic High Beams"],
      benefits: ["Accident Prevention", "Peace of Mind", "Confident Driving"],
      details: [
        {
          title: "Pre-Collision System",
          description: "Helps detect vehicles and pedestrians ahead, providing alerts and automatic emergency braking when needed.",
          image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce8d5bf3/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
          specs: ["Camera and radar detection", "Pedestrian detection", "Cyclist detection", "Automatic emergency braking"],
          benefits: ["Collision avoidance", "Injury reduction", "Property protection"]
        }
      ]
    },
    {
      id: "technology",
      title: "Connected Technology",
      description: "Stay connected with intuitive smart features",
      icon: Smartphone,
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
      highlights: ["9-inch Touchscreen", "Apple CarPlay", "Android Auto", "Wireless Charging"],
      benefits: ["Seamless Integration", "Hands-Free", "Always Updated"],
      details: [
        {
          title: "Infotainment System",
          description: "Intuitive 9-inch touchscreen with smartphone integration and premium audio system.",
          image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
          specs: ["9-inch touchscreen", "Wireless Apple CarPlay", "Android Auto", "6-speaker audio"],
          benefits: ["Easy navigation", "Music streaming", "Hands-free calls"]
        }
      ]
    },
    {
      id: "interior",
      title: "Premium Interior",
      description: "Thoughtfully designed for comfort and convenience",
      icon: Car,
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
      highlights: ["SofTex Seating", "Dual-Zone Climate", "60/40 Split Rear", "Ample Storage"],
      benefits: ["All-Day Comfort", "Personal Climate", "Versatile Space"],
      details: [
        {
          title: "Seating & Comfort",
          description: "Premium SofTex seating surfaces with supportive design for long-distance comfort.",
          image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/84e8c1f6-161b-4fad-a1b2-aa9f00446b1d/renditions/c46fa084-5605-492e-8834-fae4693096f4?binary=true&mformat=true",
          specs: ["SofTex seating surfaces", "8-way power driver seat", "Heated front seats", "60/40 split rear seat"],
          benefits: ["Durable materials", "Adjustable comfort", "Flexible cargo space"]
        }
      ]
    }
  ];

  const handleCategoryExplore = (category: FeatureCategory) => {
    setSelectedCategory(category);
  };

  const handleModalClose = () => {
    setSelectedCategory(null);
  };

  const handleBookTestDrive = () => {
    // This would typically trigger the test drive modal
    console.log('Book test drive clicked');
  };

  if (!isVisible) {
    return (
      <div ref={elementRef} className="h-96 bg-muted/20 animate-pulse rounded-lg" />
    );
  }

  return (
    <div ref={elementRef} className="relative bg-gradient-to-b from-background to-muted/20">
      {/* Enhanced Header */}
      <div className="text-center py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Badge variant="outline" className="px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            Key Features
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {vehicle.name}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Discover the advanced technologies and premium features that make every drive exceptional
          </p>
        </motion.div>
      </div>

      {/* Feature Categories Grid */}
      <div className="px-4 md:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {featureCategories.map((category, index) => (
            <FeatureCategory
              key={category.id}
              {...category}
              onExplore={() => handleCategoryExplore(category)}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center py-8 px-4"
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-xl md:text-2xl font-bold">
            Ready to Experience These Features?
          </h3>
          <p className="text-muted-foreground">
            Schedule a test drive to discover how these technologies enhance your daily driving experience.
          </p>
          <Button size="lg" className="group">
            Book Your Test Drive
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </motion.div>

      {/* Simplified Modal */}
      {selectedCategory && (
        <SimpleFeatureModal
          isOpen={!!selectedCategory}
          onClose={handleModalClose}
          onBookTestDrive={handleBookTestDrive}
          title={selectedCategory.title}
          description={selectedCategory.description}
          category={selectedCategory.id}
          features={selectedCategory.details}
        />
      )}
    </div>
  );
};

export default VehicleMediaShowcase;
