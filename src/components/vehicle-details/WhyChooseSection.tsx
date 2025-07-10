
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Shield, Gauge, Leaf, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface WhyChooseSectionProps {
  vehicleName: string;
  galleryImages: string[];
}

const WhyChooseSection: React.FC<WhyChooseSectionProps> = ({ vehicleName, galleryImages }) => {
  const isMobile = useIsMobile();

  const premiumFeatures = [
    { 
      icon: <Zap className="h-8 w-8" />, 
      title: "Hybrid Synergy Drive", 
      value: "25.2 km/L", 
      description: "World's most advanced hybrid system with instant electric response",
      color: "from-primary to-primary/80",
      bgPattern: "bg-gradient-to-br from-primary/5 to-primary/10",
      image: galleryImages[0]
    },
    { 
      icon: <Shield className="h-8 w-8" />, 
      title: "Toyota Safety Sense 3.0", 
      value: "5-Star NCAP", 
      description: "Next-generation safety with AI-powered collision prevention",
      color: "from-green-500 to-emerald-400",
      bgPattern: "bg-gradient-to-br from-green-50 to-emerald-50",
      image: galleryImages[1]
    },
    { 
      icon: <Gauge className="h-8 w-8" />, 
      title: "Dynamic Performance", 
      value: "218 HP Total", 
      description: "Seamlessly blended electric and gasoline power delivery",
      color: "from-orange-500 to-red-400",
      bgPattern: "bg-gradient-to-br from-orange-50 to-red-50",
      image: galleryImages[2]
    },
    { 
      icon: <Leaf className="h-8 w-8" />, 
      title: "Zero Emission Ready", 
      value: "102g CO₂/km", 
      description: "Ultra-low emissions with pure electric driving capability",
      color: "from-emerald-500 to-green-400",
      bgPattern: "bg-gradient-to-br from-emerald-50 to-green-50",
      image: galleryImages[3]
    }
  ];

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      <div className="toyota-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Premium Hybrid Technology
          </motion.div>
          <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-4 lg:mb-6 leading-tight">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              {vehicleName.split(' ').pop()}?
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the pinnacle of automotive innovation where luxury meets sustainability.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className={`${isMobile ? 'overflow-x-auto scrollbar-hide' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8'}`}>
          <div className={`${isMobile ? 'flex space-x-4 pb-4' : 'contents'}`} style={{ width: isMobile ? `${premiumFeatures.length * 260}px` : 'auto' }}>
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.01,
                  transition: { duration: 0.2 }
                }}
                className={`group cursor-pointer ${isMobile ? 'w-60 flex-shrink-0' : ''}`}
              >
                <Card className={`h-full p-6 lg:p-8 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${feature.bgPattern} relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-5">
                    <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <CardContent className="p-0 space-y-4 relative z-10">
                    <motion.div 
                      className={`inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg group-hover:scale-105 transition-transform duration-200`}
                    >
                      {feature.icon}
                    </motion.div>
                    <div className="space-y-3">
                      <motion.h3 
                        className="text-2xl lg:text-3xl font-black text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/70 transition-all duration-200"
                      >
                        {feature.value}
                      </motion.h3>
                      <h4 className="text-lg lg:text-xl font-bold text-foreground mb-2">{feature.title}</h4>
                      <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
