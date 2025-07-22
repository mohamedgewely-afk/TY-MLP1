
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Star, Shield, Zap, Car, Sparkles, Crown, Award } from "lucide-react";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface Enhanced3DGradeCardsProps {
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
}

const Enhanced3DGradeCards: React.FC<Enhanced3DGradeCardsProps> = ({ config, setConfig }) => {
  const [currentGradeIndex, setCurrentGradeIndex] = useState(0);
  const [hoveredGrade, setHoveredGrade] = useState<string | null>(null);

  const grades = [
    {
      name: "Base",
      price: 0,
      monthlyEMI: 899,
      description: "Essential features for everyday driving",
      icon: <Car className="h-6 w-6" />,
      color: "from-slate-500 to-slate-600",
      bgColor: "from-slate-50 to-slate-100",
      usps: [
        { icon: <Car className="h-4 w-4" />, title: "Essential Safety", desc: "Standard safety features" },
        { icon: <Shield className="h-4 w-4" />, title: "Warranty", desc: "3-year comprehensive warranty" },
        { icon: <Star className="h-4 w-4" />, title: "Quality", desc: "Toyota reliability standard" }
      ],
      features: ["Manual A/C", "Fabric Seats", "Basic Audio", "Standard Safety"],
      highlight: "Great Value",
      highlightColor: "bg-green-500"
    },
    {
      name: "SE",
      price: 2000,
      monthlyEMI: 945,
      description: "Sport-enhanced driving experience",
      icon: <Zap className="h-6 w-6" />,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      usps: [
        { icon: <Zap className="h-4 w-4" />, title: "Sport Tuning", desc: "Enhanced suspension setup" },
        { icon: <Car className="h-4 w-4" />, title: "Sport Styling", desc: "Unique exterior elements" },
        { icon: <Star className="h-4 w-4" />, title: "Premium Audio", desc: "6-speaker sound system" }
      ],
      features: ["Sport Seats", "Enhanced Audio", "Sport Suspension", "Alloy Wheels"],
      highlight: "Sport Package",
      highlightColor: "bg-orange-500"
    },
    {
      name: "XLE",
      price: 4000,
      monthlyEMI: 1099,
      description: "Premium comfort and convenience",
      icon: <Award className="h-6 w-6" />,
      color: "from-blue-500 to-purple-500",
      bgColor: "from-blue-50 to-purple-50",
      usps: [
        { icon: <Star className="h-4 w-4" />, title: "Premium Interior", desc: "Leather-appointed seats" },
        { icon: <Zap className="h-4 w-4" />, title: "Smart Features", desc: "Advanced connectivity" },
        { icon: <Shield className="h-4 w-4" />, title: "Enhanced Safety", desc: "Additional safety tech" }
      ],
      features: ["Leather Seats", "Dual-Zone Climate", "Premium Audio", "Advanced Safety"],
      highlight: "Most Popular",
      highlightColor: "bg-primary"
    },
    {
      name: "Limited",
      price: 6000,
      monthlyEMI: 1249,
      description: "Luxury features and premium materials",
      icon: <Crown className="h-6 w-6" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      usps: [
        { icon: <Star className="h-4 w-4" />, title: "Luxury Interior", desc: "Premium leather & wood trim" },
        { icon: <Zap className="h-4 w-4" />, title: "Tech Suite", desc: "Full technology package" },
        { icon: <Shield className="h-4 w-4" />, title: "Complete Safety", desc: "All available safety features" }
      ],
      features: ["Premium Leather", "Panoramic Sunroof", "JBL Audio", "Full Safety Suite"],
      highlight: "Ultimate Luxury",
      highlightColor: "bg-purple-500"
    },
    {
      name: "Platinum",
      price: 10000,
      monthlyEMI: 1449,
      description: "The ultimate Toyota experience",
      icon: <Sparkles className="h-6 w-6" />,
      color: "from-amber-400 to-yellow-500",
      bgColor: "from-amber-50 to-yellow-50",
      usps: [
        { icon: <Star className="h-4 w-4" />, title: "Platinum Exclusive", desc: "Unique luxury appointments" },
        { icon: <Zap className="h-4 w-4" />, title: "Advanced Tech", desc: "Latest technology features" },
        { icon: <Shield className="h-4 w-4" />, title: "Premium Care", desc: "Extended warranty & service" }
      ],
      features: ["Platinum Interior", "Advanced Driver Assist", "Premium JBL Audio", "Exclusive Styling"],
      highlight: "Top of the Line",
      highlightColor: "bg-amber-500"
    }
  ];

  const currentGrade = grades[currentGradeIndex];

  const nextGrade = () => {
    setCurrentGradeIndex((prev) => (prev + 1) % grades.length);
  };

  const prevGrade = () => {
    setCurrentGradeIndex((prev) => (prev - 1 + grades.length) % grades.length);
  };

  const selectCurrentGrade = () => {
    setConfig(prev => ({ ...prev, grade: currentGrade.name }));
  };

  return (
    <div className="space-y-6 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.h3 
          className="text-2xl font-bold text-foreground mb-2"
          animate={{
            backgroundImage: [
              "linear-gradient(90deg, hsl(var(--foreground)), hsl(var(--foreground)))",
              "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--foreground)))",
              "linear-gradient(90deg, hsl(var(--foreground)), hsl(var(--foreground)))"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Choose Your Grade
        </motion.h3>
        <p className="text-sm text-muted-foreground mb-4">
          Experience luxury, performance, and innovation
        </p>
      </motion.div>

      {/* Enhanced 3D Card Carousel */}
      <div className="relative perspective-1000">
        {/* Navigation Buttons with 3D Effects */}
        <motion.button
          onClick={prevGrade}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 backdrop-blur-xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 -translate-x-4 group"
          whileHover={{ 
            scale: 1.1, 
            rotateY: 10,
            boxShadow: "0 25px 80px rgba(0, 0, 0, 0.25)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="h-5 w-5 text-foreground group-hover:-translate-x-0.5 transition-transform duration-200" />
        </motion.button>
        
        <motion.button
          onClick={nextGrade}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 backdrop-blur-xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 translate-x-4 group"
          whileHover={{ 
            scale: 1.1, 
            rotateY: -10,
            boxShadow: "0 25px 80px rgba(0, 0, 0, 0.25)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="h-5 w-5 text-foreground group-hover:translate-x-0.5 transition-transform duration-200" />
        </motion.button>

        {/* Enhanced 3D Grade Card */}
        <div className="mx-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGradeIndex}
              initial={{ 
                opacity: 0, 
                x: 300, 
                rotateY: 45,
                scale: 0.8
              }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                rotateY: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                x: -300, 
                rotateY: -45,
                scale: 0.8
              }}
              transition={{ 
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
              }}
              onHoverStart={() => setHoveredGrade(currentGrade.name)}
              onHoverEnd={() => setHoveredGrade(null)}
            >
              <motion.div
                className="relative transform-gpu"
                whileHover={{ 
                  rotateY: 5,
                  rotateX: 5,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <Card 
                  className={`overflow-hidden border-0 shadow-2xl relative`}
                  style={{
                    background: `linear-gradient(135deg, ${currentGrade.bgColor.replace('from-', '').replace(' to-', ', ')})`,
                    boxShadow: hoveredGrade === currentGrade.name 
                      ? "0 30px 100px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                      : "0 20px 60px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  {/* Floating highlight badge */}
                  <motion.div
                    className="absolute -top-2 -right-2 z-10"
                    animate={{
                      y: [0, -5, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Badge className={`${currentGrade.highlightColor} text-white border-white/30 text-xs px-3 py-1 shadow-lg`}>
                      {currentGrade.highlight}
                    </Badge>
                  </motion.div>

                  <CardContent className="p-0 relative overflow-hidden">
                    {/* Enhanced Header with Gradient */}
                    <motion.div 
                      className={`bg-gradient-to-r ${currentGrade.color} text-white p-6 relative overflow-hidden`}
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${currentGrade.color.replace('from-', '').replace(' to-', ', ')})`
                      }}
                    >
                      {/* Animated background pattern */}
                      <motion.div
                        className="absolute inset-0 opacity-10"
                        animate={{
                          backgroundPosition: ["0% 0%", "100% 100%"],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        style={{
                          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                          backgroundSize: "20px 20px"
                        }}
                      />

                      <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"
                            animate={{
                              scale: [1, 1.05, 1],
                              rotate: [0, 5, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            {currentGrade.icon}
                          </motion.div>
                          <h4 className="text-2xl font-bold">{currentGrade.name}</h4>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm mb-4 relative z-10">{currentGrade.description}</p>
                      
                      {/* Enhanced Pricing Section */}
                      <div className="pt-3 border-t border-white/20 relative z-10">
                        <div className="flex items-center justify-between">
                          <div>
                            <motion.div 
                              className="text-2xl font-bold"
                              animate={{
                                scale: [1, 1.02, 1],
                                textShadow: [
                                  "0 0 0 rgba(255,255,255,0)",
                                  "0 0 20px rgba(255,255,255,0.3)",
                                  "0 0 0 rgba(255,255,255,0)"
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              {currentGrade.price > 0 ? `+AED ${currentGrade.price.toLocaleString()}` : "Included"}
                            </motion.div>
                            <div className="text-white/80 text-xs">From AED {currentGrade.monthlyEMI}/month</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Enhanced Content Section */}
                    <div className="p-6">
                      {/* Key Benefits with 3D Icons */}
                      <h5 className="font-bold text-foreground mb-4 flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>Key Benefits</span>
                      </h5>
                      <div className="grid grid-cols-1 gap-3 mb-6">
                        {currentGrade.usps.map((usp, index) => (
                          <motion.div
                            key={usp.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className="flex items-start space-x-3 p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-200 group"
                            whileHover={{ scale: 1.02, y: -2 }}
                          >
                            <motion.div 
                              className="p-2 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform duration-200"
                              whileHover={{ rotate: 10 }}
                            >
                              {usp.icon}
                            </motion.div>
                            <div className="flex-1">
                              <h6 className="font-semibold text-sm">{usp.title}</h6>
                              <p className="text-xs text-muted-foreground">{usp.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Features List with Enhanced Icons */}
                      <h5 className="font-bold text-foreground mb-3 flex items-center space-x-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span>Included Features</span>
                      </h5>
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {currentGrade.features.map((feature, index) => (
                          <motion.div 
                            key={feature} 
                            className="flex items-center space-x-2 text-xs"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05, duration: 0.2 }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 360 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Check className="h-3 w-3 text-green-500" />
                            </motion.div>
                            <span>{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Enhanced Select Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={selectCurrentGrade}
                          className={`w-full text-sm font-medium transition-all duration-300 ${
                            config.grade === currentGrade.name
                              ? 'bg-green-500 hover:bg-green-600'
                              : `bg-gradient-to-r ${currentGrade.color} hover:shadow-xl hover:shadow-${currentGrade.color.split('-')[0]}/20`
                          }`}
                        >
                          {config.grade === currentGrade.name ? (
                            <div className="flex items-center">
                              <Check className="mr-2 h-4 w-4" />
                              Selected
                            </div>
                          ) : 'Select This Grade'}
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Enhanced Grade Indicators */}
        <div className="flex justify-center space-x-1 mt-6">
          {grades.map((grade, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentGradeIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === currentGradeIndex 
                  ? `w-8 bg-gradient-to-r ${grade.color}` 
                  : 'w-2.5 bg-muted-foreground/30'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Enhanced3DGradeCards;
