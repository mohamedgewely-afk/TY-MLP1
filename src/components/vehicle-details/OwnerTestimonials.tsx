
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

  // Sample owner testimonials data with car images
  const testimonials = [
    {
      name: "Ahmed Al Mansouri",
      location: "Dubai",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      carImage: "https://www.toyota.com/content/dam/toyota/vehicles/2024/camry/images/desktop/hero/camry-24-hero-desktop-d.jpg",
      testimonial: "My family and I have been driving the Toyota Camry for over 2 years now. The fuel efficiency is incredible, and the comfort level makes long drives a pleasure. The safety features give me peace of mind when driving with my children.",
      ownership: "2 years",
    },
    {
      name: "Sara Johnson",
      location: "Abu Dhabi",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      carImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      testimonial: "As a busy professional, I needed a reliable car that wouldn't let me down. My Toyota has exceeded all expectations with its smooth ride and advanced tech features. The apple carplay integration is seamless, and I love the fuel economy.",
      ownership: "1.5 years",
    },
    {
      name: "Mohammed Hassan",
      location: "Sharjah",
      rating: 4,
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      carImage: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80",
      testimonial: "After comparing several sedans, I chose the Toyota for its reputation for reliability. After a year of ownership, I'm impressed with how well it handles the UAE heat and how little maintenance it requires. Great value for money!",
      ownership: "1 year",
    },
    {
      name: "Fatima Al Zaabi",
      location: "Ras Al Khaimah",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      carImage: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=800&q=80",
      testimonial: "This is my third Toyota and definitely the best one yet. The cabin is quiet, the acceleration is responsive, and the hybrid system is so smooth you barely notice when it switches between electric and gas power.",
      ownership: "8 months",
    },
  ];

  // Add swipe functionality for carousel
  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => api?.scrollNext(),
    onSwipeRight: () => api?.scrollPrev(),
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Owners Say
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Real experiences from real {vehicle.name} owners across the UAE.
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
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                      {/* Car Image */}
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={testimonial.carImage} 
                          alt={`${testimonial.name}'s car`} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                      
                      <CardContent className="p-6 relative">
                        <Quote className="absolute top-4 right-4 h-8 w-8 text-gray-200 dark:text-gray-700" />
                        
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{testimonial.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {testimonial.location} • {testimonial.ownership} ownership
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 italic">
                          "{testimonial.testimonial}"
                        </p>
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
        </div>
      </div>
    </section>
  );
};

export default OwnerTestimonials;
