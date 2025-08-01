
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Users, Camera, Mountain, Briefcase, Heart } from "lucide-react";
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
import { useSwipeable } from "@/hooks/use-swipeable";

interface LifestyleGalleryProps {
  vehicle: VehicleModel;
}

// Enhanced high-quality lifestyle images
const lifestyleCards = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "Family Adventures",
    description: "Spacious, comfortable, and built for the whole family—perfect for road trips, weekend outings, and creating lasting memories together.",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",
    tags: ["Family", "Safety", "Comfort"],
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Urban Exploration",
    description: "Navigate city streets and discover urban hotspots with style, efficiency, and the confidence that comes with Toyota reliability.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    tags: ["City", "Efficiency", "Style"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Mountain className="h-6 w-6" />,
    title: "Desert Escapes",
    description: "Experience the real UAE: majestic sand dunes, thrilling adventures, and unforgettable journeys into the heart of Arabian landscapes.",
    image: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
    tags: ["Adventure", "Desert", "Exploration"],
    color: "from-orange-500 to-amber-500"
  },
  {
    icon: <Camera className="h-6 w-6" />,
    title: "Weekend Getaways",
    description: "Your reliable companion for spontaneous trips, coastal escapes, mountain drives, and those perfect Instagram-worthy moments.",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
    tags: ["Weekend", "Travel", "Recreation"],
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Adventure Destinations",
    description: "Explore the great outdoors with confidence, knowing your Toyota is ready for any terrain and any adventure that awaits.",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
    tags: ["Outdoor", "Adventure", "Reliability"],
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <Briefcase className="h-6 w-6" />,
    title: "Business Excellence",
    description: "Make a lasting impression with professional presence, cutting-edge technology, and the sophistication that defines your success.",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80",
    tags: ["Business", "Professional", "Technology"],
    color: "from-gray-600 to-slate-600"
  },
];

const LifestyleGallery: React.FC<LifestyleGalleryProps> = ({ vehicle }) => {
  const [api, setApi] = React.useState<any>();

  // Add swipe functionality for carousel
  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => api?.scrollNext(),
    onSwipeRight: () => api?.scrollPrev(),
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  // Premium easing curve
  const premiumEasing = [0.25, 0.1, 0.25, 1];

  return (
    <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"></div>
      </div>
      
      <div className="toyota-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: premiumEasing }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Heart className="h-4 w-4 mr-2" />
            Toyota Lifestyle Experience
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">{vehicle.name}</span> Lifestyle
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Discover how the {vehicle.name} seamlessly adapts to your lifestyle—whether it's family adventures, 
            business commitments, or weekend escapes, your Toyota is ready for every journey.
          </p>
        </motion.div>

        <div ref={swipeableRef}>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
            setApi={setApi}
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {lifestyleCards.map((card, index) => (
                <CarouselItem key={card.title} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08, ease: premiumEasing }}
                  >
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-700 h-full group border-none shadow-xl bg-card">
                      <div className="h-72 overflow-hidden relative">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Enhanced Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-300" />
                        
                        {/* Premium Icon Badge */}
                        <div className={`absolute top-6 left-6 p-3 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                          {card.icon}
                        </div>
                        
                        {/* Tags */}
                        <div className="absolute top-6 right-6 flex flex-wrap gap-2">
                          {card.tags.map((tag) => (
                            <span key={tag} className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.div
                            className="bg-white/95 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          >
                            Explore {card.title}
                          </motion.div>
                        </div>
                      </div>
                      
                      <CardContent className="p-8">
                        <div className="flex items-start mb-4">
                          <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors duration-300">
                            {card.title}
                          </h3>
                        </div>
                        
                        <p className="text-muted-foreground mb-6 leading-relaxed text-base">
                          {card.description}
                        </p>
                        
                        <Button
                          variant="link"
                          className="p-0 h-auto text-primary hover:text-primary/80 group-hover:translate-x-2 transition-all duration-300 font-semibold"
                          asChild
                        >
                          <a href={`/lifestyle/${card.title.toLowerCase().replace(' ', '-')}/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center">
                            Learn More <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Enhanced Navigation Controls */}
            <div className="flex justify-center mt-12 gap-4">
              <CarouselPrevious className="relative inset-auto h-14 w-14 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110" />
              <CarouselNext className="relative inset-auto h-14 w-14 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110" />
            </div>
          </Carousel>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: premiumEasing }}
          className="text-center mt-16"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/85 text-primary-foreground px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <a href="/lifestyle">Explore Complete Toyota Lifestyle</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default LifestyleGallery;
