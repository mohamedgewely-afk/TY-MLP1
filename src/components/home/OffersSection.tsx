
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronLeft, ChevronRight, Percent, Gift, Clock } from "lucide-react";

interface OffersSectionProps {
  onOfferClick?: (offer: any) => void;
}

const OffersSection: React.FC<OffersSectionProps> = ({ onOfferClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const offers = [
    {
      id: 1,
      title: "0% Interest Rate",
      subtitle: "On Selected Models",
      description: "Get 0% interest rate financing on selected Toyota models. Limited time offer.",
      discount: "0% APR",
      validUntil: "Dec 31, 2024",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
      color: "from-green-500 to-emerald-600",
      icon: <Percent className="h-6 w-6" />
    },
    {
      id: 2,
      title: "AED 5,000 Cashback",
      subtitle: "Hybrid Models",
      description: "Get AED 5,000 cashback on all Toyota Hybrid models. Eco-friendly and economical.",
      discount: "AED 5,000",
      validUntil: "Jan 15, 2025",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
      color: "from-blue-500 to-cyan-600",
      icon: <Gift className="h-6 w-6" />
    },
    {
      id: 3,
      title: "Extended Warranty",
      subtitle: "5 Years Coverage",
      description: "Enjoy peace of mind with extended 5-year warranty on all new Toyota purchases.",
      discount: "5 Years",
      validUntil: "Mar 31, 2025",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
      color: "from-purple-500 to-pink-600",
      icon: <Clock className="h-6 w-6" />
    }
  ];

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
    if (scrollRef.current) {
      const newIndex = (currentIndex - 1 + offers.length) % offers.length;
      scrollRef.current.scrollTo({
        left: newIndex * scrollRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % offers.length);
    if (scrollRef.current) {
      const newIndex = (currentIndex + 1) % offers.length;
      scrollRef.current.scrollTo({
        left: newIndex * scrollRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleOfferClick = (offer: any) => {
    if (onOfferClick) {
      onOfferClick(offer);
    }
  };

  return (
    <section className="py-8 lg:py-16 bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden">
      <div className="toyota-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-12"
        >
          <h2 className="text-2xl lg:text-4xl font-black text-foreground mb-4">
            Special{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Offers
            </span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover exclusive deals and limited-time offers on your favorite Toyota models.
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-2 lg:-left-6 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border hover:shadow-xl transition-all min-h-[44px] min-w-[44px]"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-2 lg:-right-6 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border hover:shadow-xl transition-all min-h-[44px] min-w-[44px]"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>

          {/* Offers Carousel */}
          <div 
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-4 lg:gap-6 pb-4" style={{ width: `${offers.length * 100}%` }}>
              {offers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  className="snap-center flex-shrink-0"
                  style={{ width: `${100 / offers.length}%` }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="h-full overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                    onClick={() => handleOfferClick(offer)}
                  >
                    <div className="relative h-48 lg:h-64 overflow-hidden">
                      <img 
                        src={offer.image} 
                        alt={offer.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${offer.color} opacity-80`} />
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/20 text-white backdrop-blur-sm border-white/30">
                          Limited Time
                        </Badge>
                      </div>
                      
                      <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        {offer.icon}
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-1">{offer.title}</h3>
                          <p className="text-sm text-primary font-medium">{offer.subtitle}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-primary">{offer.discount}</div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {offer.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Valid until {offer.validUntil}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-primary/80 p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOfferClick(offer);
                          }}
                        >
                          Learn More <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30 w-2'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
