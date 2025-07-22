import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Shield, ArrowUpDown } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useSwipeable } from "@/hooks/use-swipeable";

interface VehicleGrade {
  id: string;
  name: string;
  price: number;
  badge?: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  specs: {
    engine: string;
    power: string;
    fuelEconomy: string;
    transmission: string;
  };
  image: string;
  popular?: boolean;
}

interface VehicleGradesProps {
  vehicle: VehicleModel;
}

const VehicleGrades: React.FC<VehicleGradesProps> = ({ vehicle }) => {
  const [selectedGrade, setSelectedGrade] = useState(0);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([]);

  const grades: VehicleGrade[] = [
    {
      id: "base",
      name: "LE",
      price: vehicle.price,
      badge: "Base",
      icon: <Star className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600",
      features: [
        "Toyota Safety Sense 3.0",
        "8-inch Touchscreen",
        "Dual-zone Climate Control",
        "LED Headlights",
        "Backup Camera"
      ],
      specs: {
        engine: "2.5L 4-Cylinder Hybrid",
        power: "208 HP",
        fuelEconomy: "22.2 km/L",
        transmission: "CVT"
      },
      image: "https://images.unsplash.com/photo-1494976688531-c21fd785c8d0?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "mid",
      name: "XLE",
      price: vehicle.price + 15000,
      badge: "Popular",
      icon: <Zap className="h-6 w-6" />,
      color: "from-emerald-500 to-emerald-600",
      popular: true,
      features: [
        "All LE Features",
        "Premium Audio System",
        "Wireless Charging",
        "Power Moonroof",
        "Heated Front Seats",
        "Smart Key System"
      ],
      specs: {
        engine: "2.5L 4-Cylinder Hybrid",
        power: "218 HP",
        fuelEconomy: "23.8 km/L",
        transmission: "CVT"
      },
      image: "https://images.unsplash.com/photo-1571088520017-b4e1b2e1c6dd?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "premium",
      name: "Limited",
      price: vehicle.price + 25000,
      badge: "Premium",
      icon: <Crown className="h-6 w-6" />,
      color: "from-purple-500 to-purple-600",
      features: [
        "All XLE Features",
        "Leather-trimmed Seats",
        "Premium JBL Audio",
        "360-degree Camera",
        "Ventilated Front Seats",
        "Head-up Display",
        "Advanced Parking Assist"
      ],
      specs: {
        engine: "2.5L 4-Cylinder Hybrid",
        power: "218 HP",
        fuelEconomy: "23.8 km/L",
        transmission: "CVT"
      },
      image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const nextGrade = () => {
    setSelectedGrade((prev) => (prev + 1) % grades.length);
  };

  const prevGrade = () => {
    setSelectedGrade((prev) => (prev - 1 + grades.length) % grades.length);
  };

  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: nextGrade,
    onSwipeRight: prevGrade,
    threshold: 30,
    debug: true
  });

  const toggleCompareSelection = (index: number) => {
    if (selectedForCompare.includes(index)) {
      setSelectedForCompare(selectedForCompare.filter(i => i !== index));
    } else if (selectedForCompare.length < 3) {
      setSelectedForCompare([...selectedForCompare, index]);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-6">
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Grade
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Select the perfect trim level that matches your lifestyle and preferences
          </p>
          
          {/* Compare Toggle */}
          <div className="mt-8 flex justify-center">
            <Button
              variant={compareMode ? "default" : "outline"}
              onClick={() => {
                setCompareMode(!compareMode);
                setSelectedForCompare([]);
              }}
              className="flex items-center space-x-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>{compareMode ? "Exit Compare" : "Compare Grades"}</span>
            </Button>
          </div>
        </motion.div>

        {!compareMode ? (
          /* Grade Selection View - Enhanced with Swipe */
          <div className="space-y-8">
            {/* Grade Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {grades.map((grade, index) => (
                <motion.button
                  key={grade.id}
                  onClick={() => setSelectedGrade(index)}
                  className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedGrade === index
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center space-x-2">
                    {grade.icon}
                    <span>{grade.name}</span>
                  </div>
                  {grade.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500 text-xs">
                      Popular
                    </Badge>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Selected Grade Details - With Swipe Support */}
            <div 
              ref={swipeableRef} 
              className="touch-manipulation select-none overflow-hidden"
              style={{ touchAction: 'pan-x' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedGrade}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="grid lg:grid-cols-2 gap-8 lg:gap-12"
                >
                  {/* Image */}
                  <div className="relative">
                    <motion.img
                      src={grades[selectedGrade].image}
                      alt={grades[selectedGrade].name}
                      className="w-full h-80 lg:h-96 object-cover rounded-2xl"
                      layoutId={`grade-image-${selectedGrade}`}
                    />
                    <Badge className={`absolute top-4 left-4 bg-gradient-to-r ${grades[selectedGrade].color} text-white`}>
                      {grades[selectedGrade].badge}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl lg:text-3xl font-bold mb-2">
                        {vehicle.name} {grades[selectedGrade].name}
                      </h3>
                      <p className="text-2xl font-bold text-primary">
                        From AED {grades[selectedGrade].price.toLocaleString()}
                      </p>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(grades[selectedGrade].specs).map(([key, value]) => (
                        <div key={key} className="bg-muted rounded-lg p-3">
                          <div className="text-sm text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </div>
                          <div className="font-semibold">{value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="font-semibold mb-3">Key Features</h4>
                      <div className="space-y-2">
                        {grades[selectedGrade].features.map((feature, idx) => (
                          <motion.div
                            key={feature}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center space-x-3"
                          >
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex space-x-4 pt-4">
                      <Button size="lg" className="flex-1">
                        Configure {grades[selectedGrade].name}
                      </Button>
                      <Button variant="outline" size="lg">
                        Test Drive
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Enhanced Mobile Swipe Indicator */}
              <div className="flex justify-center mt-6 md:hidden">
                <div className="flex items-center space-x-2 bg-muted rounded-full px-4 py-2">
                  <div className="flex space-x-2">
                    {grades.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === selectedGrade ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground ml-3">Swipe to navigate</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Compare Mode */
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                Select up to 3 grades to compare
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {grades.map((grade, index) => (
                <motion.div
                  key={grade.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative cursor-pointer ${
                    selectedForCompare.includes(index) ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => toggleCompareSelection(index)}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${grade.color} flex items-center justify-center text-white`}>
                          {grade.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl">{grade.name}</h3>
                          <p className="text-primary font-semibold">
                            AED {grade.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-2 text-left">
                          {grade.features.slice(0, 3).map((feature) => (
                            <div key={feature} className="flex items-center space-x-2 text-sm">
                              <Check className="h-3 w-3 text-green-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {selectedForCompare.includes(index) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {selectedForCompare.length > 1 && (
              <div className="text-center">
                <Button size="lg" className="px-8">
                  Compare Selected Grades ({selectedForCompare.length})
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default VehicleGrades;
