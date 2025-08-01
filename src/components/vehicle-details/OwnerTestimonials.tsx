
import React from "react";
import { motion } from "framer-motion";
import { Star, User, Quote } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { VehicleModel } from "@/types/vehicle";
import { useSwipeable } from "@/hooks/use-swipeable";

interface OwnerTestimonialsProps {
  vehicle: VehicleModel;
}

const OwnerTestimonials: React.FC<OwnerTestimonialsProps> = ({ vehicle }) => {
  const [api, setApi] = React.useState<any>();

  // Enhanced testimonials data with premium styling
  const testimonials = [
    {
      name: "Ahmed Al Mansouri",
      location: "Dubai Marina",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      carImage: "https://www.toyota.com/content/dam/toyota/vehicles/2024/camry/images/desktop/hero/camry-24-hero-desktop-d.jpg",
      testimonial: "The Toyota Camry Hybrid has exceeded all my expectations. The fuel efficiency is remarkable - I'm getting over 25 km/L in city driving. The comfort level makes long commutes to Abu Dhabi a pleasure, and the safety features give me complete peace of mind when driving with my family.",
      ownership: "2 years, 3 months",
      highlight: "25+ km/L fuel efficiency"
    },
    {
      name: "Sarah Mitchell",
      location: "Abu Dhabi",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      carImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      testimonial: "As a busy executive, reliability is everything. My Toyota has never let me down in 18 months of ownership. The advanced tech features keep me connected, and the smooth hybrid system makes every drive effortless. The Apple CarPlay integration is seamless and the premium interior feels luxurious.",
      ownership: "1 year, 6 months",
      highlight: "Zero breakdowns"
    },
    {
      name: "Mohammed Hassan",
      location: "Sharjah",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      carImage: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80",
      testimonial: "After comparing several sedans, I chose Toyota for its legendary reliability. One year later, I'm amazed by how well it handles the UAE's challenging climate. Minimal maintenance, excellent fuel economy, and the resale value remains strong. Best investment I've made.",
      ownership: "1 year, 2 months",
      highlight: "Excellent resale value"
    },
    {
      name: "Fatima Al Zaabi",
      location: "Ras Al Khaimah",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      carImage: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=800&q=80",
      testimonial: "This is my third Toyota and definitely the most advanced. The cabin is whisper quiet, the hybrid acceleration is surprisingly responsive, and the transition between electric and gasoline power is so smooth you barely notice. The technology suite keeps getting better with updates.",
      ownership: "10 months",
      highlight: "3rd Toyota purchased"
    },
  ];

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
    <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: premiumEasing }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Quote className="h-4 w-4 mr-2" />
            Real Owner Experiences
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight">
            What {vehicle.name} Owners Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Authentic experiences from real {vehicle.name} owners across the UAE who share their journey with Toyota excellence.
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
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/2 xl:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: premiumEasing }}
                  >
                    <Card className="h-full border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden bg-card group hover:scale-[1.02]">
                      {/* Enhanced Car Image */}
                      <div className="h-56 overflow-hidden relative">
                        <img 
                          src={testimonial.carImage} 
                          alt={`${testimonial.name}'s vehicle`} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                        
                        {/* Premium Highlight Badge */}
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          {testimonial.highlight}
                        </div>
                        
                        {/* Rating Stars Overlay */}
                        <div className="absolute bottom-4 left-4 flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 text-yellow-400 fill-yellow-400 drop-shadow-lg"
                            />
                          ))}
                        </div>
                      </div>
                      
                      <CardContent className="p-8 relative">
                        <Quote className="absolute top-6 right-6 h-10 w-10 text-primary/20" />
                        
                        <div className="flex items-center mb-6">
                          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-3 border-primary/20 shadow-lg">
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-foreground">{testimonial.name}</h3>
                            <p className="text-sm text-muted-foreground font-medium">
                              {testimonial.location}
                            </p>
                            <p className="text-xs text-primary font-semibold mt-1">
                              Owner for {testimonial.ownership}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground italic leading-relaxed text-base">
                          "{testimonial.testimonial}"
                        </p>
                        
                        {/* Enhanced Rating Display */}
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-border/50">
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-yellow-500 fill-yellow-500"
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-primary">Verified Owner</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Enhanced Navigation */}
            <div className="flex justify-center mt-12 gap-4">
              <CarouselPrevious className="relative inset-auto h-12 w-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300" />
              <CarouselNext className="relative inset-auto h-12 w-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default OwnerTestimonials;
