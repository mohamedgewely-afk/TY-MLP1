
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  image: string;
  category: string;
  terms: string[];
}

interface OffersSectionProps {
  onOfferClick: (offer: Offer) => void;
}

const OffersSection: React.FC<OffersSectionProps> = ({ onOfferClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

  const offers: Offer[] = [
    {
      id: "1",
      title: "0% APR Financing",
      description: "Get 0% APR financing for up to 60 months on select Toyota models.",
      discount: "0% APR",
      validUntil: "December 31, 2024",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      category: "Financing",
      terms: ["Subject to approved credit", "Select models only", "May not be combined with other offers"]
    },
    {
      id: "2", 
      title: "Cash Back Bonus",
      description: "Get up to AED 5,000 cash back on your new Toyota purchase.",
      discount: "AED 5,000",
      validUntil: "January 15, 2025",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      category: "Cash Back",
      terms: ["Must finance through Toyota Financial", "Cannot be combined with 0% APR offer", "New vehicle purchases only"]
    },
    {
      id: "3",
      title: "Loyalty Bonus",
      description: "Current Toyota owners get an additional AED 2,500 loyalty bonus.",
      discount: "AED 2,500",
      validUntil: "March 31, 2025",
      image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      category: "Loyalty",
      terms: ["Must own a Toyota for at least 2 years", "Trade-in required", "Proof of ownership required"]
    },
    {
      id: "4",
      title: "Graduate Program",
      description: "Recent graduates get special pricing and financing options.",
      discount: "Up to AED 3,000",
      validUntil: "June 30, 2025",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      category: "Graduate",
      terms: ["Graduated within 2 years", "Proof of graduation required", "Subject to credit approval"]
    }
  ];

  const nextOffer = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  const prevOffer = () => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const visibleOffers = isMobile ? 1 : 3;
  const maxIndex = offers.length - visibleOffers;

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground mb-4">
            Special Offers
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-4 lg:mb-6">
            Limited Time Deals
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't miss out on these exclusive offers. Save more on your dream Toyota today.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevOffer}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-xl border hover:shadow-2xl transition-all duration-300 -translate-x-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={nextOffer}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-xl border hover:shadow-2xl transition-all duration-300 translate-x-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Offers Grid */}
          <div className="overflow-hidden mx-8">
            <motion.div
              className={`grid gap-6 transition-transform duration-500 ${
                isMobile ? 'grid-cols-1' : 'grid-cols-3'
              }`}
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleOffers)}%)`
              }}
            >
              {offers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group cursor-pointer"
                  onClick={() => onOfferClick(offer)}
                >
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] bg-white">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/95 text-gray-900 border-0 shadow-md">
                          {offer.category}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary text-primary-foreground border-0 shadow-md font-bold">
                          {offer.discount}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {offer.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {offer.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Valid until {offer.validUntil}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary-foreground hover:bg-primary group-hover:translate-x-1 transition-all duration-200"
                          >
                            Learn More
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary w-8 shadow-lg' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
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
