
import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { Button } from "@/components/ui/button";
import { vehicles } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";
import { Link } from "react-router-dom";
import { Users, Shield, Car, Heart, CalendarCheck, CircleHelp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";

const FamilyFirstHomepage: React.FC = () => {
  const { personaData } = usePersona();
  const { toast } = useToast();
  const [favoriteVehicles, setFavoriteVehicles] = useState<string[]>([]);

  // Filter vehicles for family-friendly options
  const familyVehicles = vehicles.filter(v => 
    v.category === "SUV" || 
    v.features.some(f => f.includes("Seating") || f.includes("Safety"))
  ).slice(0, 6);

  const handleAddToFavorites = (vehicle: VehicleModel) => {
    if (favoriteVehicles.includes(vehicle.name)) {
      setFavoriteVehicles(favoriteVehicles.filter(v => v !== vehicle.name));
      toast({
        title: "Removed from favorites",
        description: `${vehicle.name} has been removed from your favorites.`,
        variant: "default",
        style: { backgroundColor: personaData?.colorScheme.primary, color: "#FFF" },
      });
    } else {
      setFavoriteVehicles([...favoriteVehicles, vehicle.name]);
      toast({
        title: "Added to favorites",
        description: `${vehicle.name} has been added to your favorites.`,
        variant: "default",
        style: { backgroundColor: personaData?.colorScheme.primary, color: "#FFF" },
      });
    }
  };

  return (
    <div className="family-friendly-bg min-h-screen">
      {/* Hero Section with rounded, friendly visuals */}
      <section className="relative h-[80vh] overflow-hidden rounded-b-[3rem] shadow-xl">
        <motion.img
          src="https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/section-05-family-suv-desktop.jpg"
          alt="Family SUV"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20 flex flex-col items-center justify-center text-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif text-white font-bold mb-4 text-shadow-lg">
              Room for Everyone, Safety for All
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
              Discover Toyota vehicles built with your family's comfort and security in mind
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-[#4A6DA7] hover:bg-[#3A5D97] text-white shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              <Link to="/vehicle/highlander" className="flex items-center gap-2 px-8 py-6 text-lg">
                Explore Family Vehicles
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Family-focused priorities section */}
      <section className="py-16 bg-white rounded-3xl mx-4 md:mx-8 -mt-10 relative z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-serif text-center font-bold mb-12 text-[#4A6DA7]"
          >
            What Matters Most to Your Family
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield className="h-12 w-12 text-[#4A6DA7]" />, title: "Safety First", description: "Advanced safety features protect your loved ones on every journey" },
              { icon: <Users className="h-12 w-12 text-[#4A6DA7]" />, title: "Space for Everyone", description: "Flexible seating configurations and ample room for the whole family" },
              { icon: <Car className="h-12 w-12 text-[#4A6DA7]" />, title: "Built to Last", description: "Reliability you can depend on for years of family adventures" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-blue-50 p-8 rounded-2xl text-center shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="mx-auto bg-white rounded-full p-4 mb-4 w-20 h-20 flex items-center justify-center shadow-md">
                  {item.icon}
                </div>
                <h3 className="text-xl font-serif font-bold mb-2 text-[#4A6DA7]">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Family vehicles carousel */}
      <section className="py-16 toyota-container">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl font-serif text-center font-bold mb-8 text-[#4A6DA7]"
        >
          Perfect Vehicles for Your Family
        </motion.h2>
        
        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {familyVehicles.map((vehicle, index) => (
              <CarouselItem key={vehicle.name} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="overflow-hidden rounded-2xl border-2 border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="relative">
                      <img 
                        src={vehicle.images[0]} 
                        alt={vehicle.name}
                        className="w-full h-48 object-cover" 
                      />
                      <button
                        onClick={() => handleAddToFavorites(vehicle)}
                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <Heart 
                          className="h-5 w-5" 
                          fill={favoriteVehicles.includes(vehicle.name) ? "#F2C94C" : "none"} 
                          stroke={favoriteVehicles.includes(vehicle.name) ? "#F2C94C" : "currentColor"} 
                        />
                      </button>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-xl font-serif font-bold mb-2">{vehicle.name}</h3>
                      <div className="flex items-center mb-3">
                        <span className="text-sm bg-blue-100 text-[#4A6DA7] px-2 py-1 rounded-full">
                          {vehicle.category}
                        </span>
                        {vehicle.features.some(f => f.includes("Safety")) && (
                          <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full ml-2">
                            Safety Features
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-[#4A6DA7]">
                          ${vehicle.price.toLocaleString()}
                        </span>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-[#4A6DA7] text-[#4A6DA7] hover:bg-[#4A6DA7] hover:text-white"
                        >
                          <Link to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1" />
          <CarouselNext className="right-1" />
        </Carousel>
      </section>

      {/* Family testimonials section */}
      <section className="py-16 bg-blue-50 rounded-t-3xl">
        <div className="toyota-container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-serif text-center font-bold mb-12 text-[#4A6DA7]"
          >
            Families Love Toyota
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "Our Toyota Highlander has been the perfect companion for our family of five. The safety features give me peace of mind when driving with the kids.",
                author: "Sarah J., mother of three",
                image: "https://images.unsplash.com/photo-1438763298591-75a0d42b7265?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
              },
              {
                quote: "The spacious interior and entertainment options keep the kids happy on long road trips. Best vehicle decision we've ever made!",
                author: "Michael T., father of two",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-md"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden">
                      <img src={testimonial.image} alt={testimonial.author} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <p className="italic text-gray-600 mb-4">"{testimonial.quote}"</p>
                    <p className="font-bold text-[#4A6DA7]">{testimonial.author}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Family help section with rounded, friendly design */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <div className="bg-[#F2C94C10] p-8 md:p-12 rounded-3xl border-2 border-[#F2C94C20] shadow-lg">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-3xl font-serif font-bold mb-4 text-[#4A6DA7]">Need Help Finding Your Perfect Family Vehicle?</h2>
                <p className="text-lg text-gray-600 mb-6">Our family vehicle specialists can help you find the perfect Toyota for your family's needs and budget.</p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild className="rounded-xl bg-[#4A6DA7]">
                    <Link to="/test-drive" className="flex items-center">
                      <CalendarCheck className="mr-2 h-5 w-5" />
                      Schedule Test Drive
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl border-[#4A6DA7] text-[#4A6DA7]">
                    <Link to="/enquire" className="flex items-center">
                      <CircleHelp className="mr-2 h-5 w-5" />
                      Ask a Question
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#4A6DA7] rounded-full opacity-10 animate-pulse"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" 
                    alt="Family specialist" 
                    className="w-full h-auto rounded-full border-4 border-white shadow-lg relative z-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FamilyFirstHomepage;
