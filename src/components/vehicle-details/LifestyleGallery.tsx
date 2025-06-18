
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VehicleModel } from "@/types/vehicle";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";

interface LifestyleGalleryProps {
  vehicle: VehicleModel;
}

// High-quality lifestyle images featuring Toyota vehicles
const toyotaLifestyleImages = [
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80", // Family road trip
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80", // Urban city driving
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", // Desert landscape
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80", // Mountain adventure
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80", // Forest adventure
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80", // Business travel
];

const LifestyleGallery: React.FC<LifestyleGalleryProps> = ({ vehicle }) => {
  const lifestyleCards = [
    {
      title: "Family Adventures",
      description: "Spacious, comfortable, and built for the whole family - perfect for road trips, city outings and weekend getaways.",
      image: toyotaLifestyleImages[0],
      link: `/lifestyle/family/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`,
      gradient: "from-blue-600 to-purple-600",
    },
    {
      title: "Urban Exploration",
      description: "Navigate city streets and urban hotspots with style, efficiency, and cutting-edge technology.",
      image: toyotaLifestyleImages[1],
      link: `/lifestyle/urban/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`,
      gradient: "from-orange-500 to-pink-500",
    },
    {
      title: "Desert Escapes",
      description: "Conquer the UAE's stunning desert landscapes with confidence, comfort, and Toyota's legendary reliability.",
      image: toyotaLifestyleImages[2],
      link: `/lifestyle/desert/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`,
      gradient: "from-yellow-500 to-red-500",
    },
    {
      title: "Weekend Getaways",
      description: "Your trusted companion for spontaneous trips, coastal drives, and mountain adventures across the Emirates.",
      image: toyotaLifestyleImages[3],
      link: `/lifestyle/weekend/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`,
      gradient: "from-green-500 to-teal-500",
    },
    {
      title: "Adventure Destinations",
      description: "Explore the great outdoors with confidence, featuring Toyota's advanced safety and performance capabilities.",
      image: toyotaLifestyleImages[4],
      link: `/lifestyle/adventure/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`,
      gradient: "from-emerald-500 to-cyan-500",
    },
    {
      title: "Business Excellence",
      description: "Make a lasting impression with Toyota's blend of sophistication, technology, and professional presence.",
      image: toyotaLifestyleImages[5],
      link: `/lifestyle/business/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`,
      gradient: "from-gray-700 to-slate-600",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-muted/50 via-background to-muted/30">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 rounded-full text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 bg-primary-foreground rounded-full mr-2 animate-pulse" />
            Lifestyle Experiences
          </motion.div>
          <h2 className="text-4xl lg:text-6xl font-black text-foreground mb-6 leading-tight">
            Your {vehicle.name.split(' ').pop()}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Lifestyle
            </span>
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Discover how the {vehicle.name} seamlessly integrates into every aspect of your life, 
            from family adventures to business excellence.
          </p>
        </motion.div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full mb-16"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {lifestyleCards.map((card, index) => (
              <CarouselItem key={card.title} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 h-full group border-0 shadow-xl">
                    <div className="h-64 overflow-hidden relative">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                      
                      {/* Overlay content */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          {card.title}
                        </h3>
                        <div className="w-12 h-1 bg-white rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      </div>
                    </div>
                    
                    <CardContent className="p-6 bg-card">
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {card.description}
                      </p>
                      <Button
                        variant="link"
                        className="p-0 text-primary hover:text-primary/80 group/btn"
                        asChild
                      >
                        <a href={card.link} className="flex items-center">
                          Explore Lifestyle 
                          <ArrowRight className="h-4 w-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8 gap-2">
            <CarouselPrevious className="relative inset-auto" />
            <CarouselNext className="relative inset-auto" />
          </div>
        </Carousel>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-primary/20 max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-4xl font-bold text-foreground mb-4">
              Ready to Live the Toyota Lifestyle?
            </h3>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Experience how Toyota seamlessly fits into every moment of your journey, 
              from daily commutes to extraordinary adventures.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-4 text-lg rounded-xl shadow-lg"
            >
              <a href="/lifestyle">Explore All Lifestyles</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LifestyleGallery;
