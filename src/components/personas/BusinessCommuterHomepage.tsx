import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { Button } from "@/components/ui/button";
import { vehicles } from "@/data/vehicles";
import { Link } from "react-router-dom";
import { VehicleModel } from "@/types/vehicle";
import { 
  Briefcase, 
  Clock, 
  Phone,
  ChevronRight, 
  Heart,
  Star,
  BookOpen,
  Calendar,
  Car
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const BusinessCommuterHomepage: React.FC = () => {
  const { personaData } = usePersona();
  const { toast } = useToast();
  const [favoriteVehicles, setFavoriteVehicles] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 200000]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Filter vehicles for business commuters - focus on sedans and premium features
  const businessVehicles = vehicles.filter(v => 
    v.category === "Sedan" || 
    v.features.some(f => f.includes("Luxury") || f.includes("Comfort"))
  );

  // Vehicle tabs
  const categories = ["All", "Sedan", "Hybrid", "SUV"];
  
  // Filter by price and category
  const filteredVehicles = businessVehicles.filter(vehicle => 
    vehicle.price >= priceRange[0] &&
    vehicle.price <= priceRange[1] &&
    (selectedCategory === "All" || vehicle.category === selectedCategory)
  );

  const handleAddToFavorites = (vehicle: VehicleModel) => {
    if (favoriteVehicles.includes(vehicle.name)) {
      setFavoriteVehicles(favoriteVehicles.filter(v => v !== vehicle.name));
      toast({
        title: "Removed from favorites",
        description: `${vehicle.name} has been removed from your favorites.`,
        variant: "default",
        style: { backgroundColor: personaData?.colorScheme.primary, color: "#FFF", borderRadius: "0" },
      });
    } else {
      setFavoriteVehicles([...favoriteVehicles, vehicle.name]);
      toast({
        title: "Added to favorites",
        description: `${vehicle.name} has been added to your favorites.`,
        variant: "default",
        style: { backgroundColor: personaData?.colorScheme.primary, color: "#FFF", borderRadius: "0" },
      });
    }
  };

  // Business-styled, elegant, minimal design
  return (
    <div className="business-pattern-bg min-h-screen">
      {/* Professional hero section with executive styling */}
      <section className="relative h-[80vh] overflow-hidden">
        <motion.div
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/business-toyota.jpg"
            alt="Business Commuter"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/30"></div>
          
          {/* Business grid overlay */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.line
                x1="0" y1="50" x2="100" y2="50"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5 }}
              />
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.line
                  key={i}
                  x1={i * 10} y1="0" x2={i * 10} y2="100"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: i * 0.1, duration: 1 }}
                />
              ))}
            </svg>
          </div>
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6 z-10">
          <motion.div className="max-w-4xl mx-auto">
            <motion.h1
              className="text-4xl md:text-6xl font-light mb-4 text-shadow-lg tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Elevate Your Daily Commute
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl mb-8 text-shadow max-w-2xl mx-auto font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Make every business trip a pleasure with Toyota's sophisticated sedans
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-[#263238] hover:bg-[#1a252a] text-white rounded-none shadow-lg border-b-2 border-[#90A4AE]"
              >
                <Link to="/new-cars" className="flex items-center px-8 py-6 text-lg">
                  Discover Business Models
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Premium features showcase */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-light mb-4 text-[#263238]">
              Professional Excellence in Every Detail
            </h2>
            <div className="h-0.5 w-24 bg-[#90A4AE] mx-auto"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Briefcase className="h-8 w-8 text-[#263238]" />,
                title: "Executive Comfort",
                description: "Premium interiors with ergonomic seating designed for long commutes and business travel"
              },
              {
                icon: <Phone className="h-8 w-8 text-[#263238]" />,
                title: "Seamless Connectivity",
                description: "Stay productive on the go with advanced connectivity features and intuitive interfaces"
              },
              {
                icon: <Clock className="h-8 w-8 text-[#263238]" />,
                title: "Efficient Performance",
                description: "Balanced power and efficiency to ensure you arrive at every meeting on time"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-6 border-b border-[#90A4AE] pb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-3 text-[#263238]">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business vehicle selector */}
      <section className="py-16 bg-gray-50 border-t border-b border-gray-200">
        <div className="toyota-container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-light mb-4 text-[#263238]">
              Select Your Professional Vehicle
            </h2>
            <div className="h-0.5 w-24 bg-[#90A4AE]"></div>
          </motion.div>
          
          <div className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={cn(
                    "rounded-none border-gray-300",
                    selectedCategory === category ? "bg-[#263238] text-white" : "text-[#263238] hover:border-[#263238]"
                  )}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <div className="bg-white p-6 border border-gray-200 mb-6">
              <div className="mb-2 flex justify-between items-center">
                <h3 className="font-medium text-[#263238]">Price Range</h3>
                <span className="text-sm text-gray-500">
                  ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                </span>
              </div>
              <Slider
                defaultValue={[0, 200000]}
                max={200000}
                step={5000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mt-6"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.slice(0, 6).map((vehicle, index) => (
              <BusinessVehicleCard
                key={vehicle.name}
                vehicle={vehicle}
                index={index}
                isFavorite={favoriteVehicles.includes(vehicle.name)}
                onFavoriteToggle={() => handleAddToFavorites(vehicle)}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              className="rounded-none border-[#263238] text-[#263238] hover:bg-[#263238] hover:text-white"
            >
              <Link to="/new-cars" className="flex items-center">
                View All Executive Vehicles
                <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Business benefits section */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <div className="flex flex-col md:flex-row items-start gap-12">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-light mb-6 text-[#263238] border-b-2 border-[#90A4AE] pb-3 inline-block">
                Business Benefits & Tax Advantages
              </h2>
              
              <p className="text-gray-600 mb-8">
                Toyota offers a range of business-friendly purchasing and leasing options that may provide tax benefits and financial advantages for professionals and companies.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Business lease options with flexible terms",
                  "Potential tax deductions for business use",
                  "Fleet management solutions for companies",
                  "Reduced maintenance costs and extended service plans"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-5 w-5 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#263238]"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-4">
                <Button
                  asChild
                  className="bg-[#263238] hover:bg-[#1a252a] text-white rounded-none"
                >
                  <Link to="/business-solutions" className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Business Guide
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  className="rounded-none border-[#263238] text-[#263238] hover:bg-[#263238] hover:text-white"
                >
                  <Link to="/tax-calculator" className="flex items-center">
                    Calculate Tax Benefits
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-50 p-8 border border-gray-200">
                <h3 className="text-xl font-medium mb-6 text-[#263238] flex items-center">
                  <Star className="h-5 w-5 mr-2 text-[#90A4AE]" />
                  Executive Ownership Program
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-[#263238] mb-2">Exclusive Benefits</h4>
                    <p className="text-gray-600 text-sm">
                      Join our Executive Ownership Program for priority servicing, exclusive events, and personal concierge.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-[#263238] mb-2">Extended Warranty</h4>
                    <p className="text-gray-600 text-sm">
                      Business clients receive additional warranty coverage tailored to high-mileage commuters.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-[#263238] mb-2">Corporate Discounts</h4>
                    <p className="text-gray-600 text-sm">
                      Special pricing available for businesses purchasing multiple vehicles for their fleet.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Button
                    asChild
                    className="w-full rounded-none bg-[#263238] hover:bg-[#1a252a] text-white"
                  >
                    <Link to="/executive-program">
                      Request Program Details
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customer testimonials in elegant style */}
      <section className="py-16 bg-gray-50">
        <div className="toyota-container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-light mb-4 text-[#263238]">
              What Business Professionals Say
            </h2>
            <div className="h-0.5 w-24 bg-[#90A4AE] mx-auto"></div>
          </motion.div>
          
          <Tabs defaultValue="executives" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-transparent border-b border-gray-200 w-full flex justify-center">
                <TabsTrigger 
                  value="executives" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#263238] data-[state=active]:text-[#263238] rounded-none hover:text-[#263238] px-6"
                >
                  Executives
                </TabsTrigger>
                <TabsTrigger 
                  value="sales" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#263238] data-[state=active]:text-[#263238] rounded-none hover:text-[#263238] px-6"
                >
                  Sales Professionals
                </TabsTrigger>
                <TabsTrigger 
                  value="entrepreneurs" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#263238] data-[state=active]:text-[#263238] rounded-none hover:text-[#263238] px-6"
                >
                  Entrepreneurs
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="executives" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    quote: "My Camry's quiet interior allows me to take important calls on the road without any background noise issues.",
                    author: "James R., CFO",
                    company: "Global Innovations Inc.",
                    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  },
                  {
                    quote: "The premium features in my Avalon make my daily commute feel like an extension of my office.",
                    author: "Sarah T., COO",
                    company: "Meridian Enterprises",
                    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  },
                  {
                    quote: "After long meetings, the comfort of my Toyota sedan makes the drive home a relaxing experience.",
                    author: "Michael K., CEO",
                    company: "Summit Solutions",
                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  }
                ].map((testimonial, index) => (
                  <BusinessTestimonial key={index} testimonial={testimonial} index={index} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="sales" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    quote: "I drive clients around daily, and they always comment on how impressive and comfortable my Toyota is.",
                    author: "Robert L., Sales Director",
                    company: "Prism Financial",
                    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  },
                  {
                    quote: "The fuel efficiency saves me thousands annually with all the client visits I make across the city.",
                    author: "Lisa J., Account Manager",
                    company: "Concord Solutions",
                    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  },
                  {
                    quote: "The trunk space handles all my product samples and presentation materials with room to spare.",
                    author: "David P., Sales Rep",
                    company: "Envision Products",
                    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  }
                ].map((testimonial, index) => (
                  <BusinessTestimonial key={index} testimonial={testimonial} index={index} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="entrepreneurs" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    quote: "As a startup founder, the reliability of my Toyota means one less thing to worry about in my busy day.",
                    author: "Emma R., Founder",
                    company: "Bright Ideas Studio",
                    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  },
                  {
                    quote: "The professional look of my sedan helps make the right first impression with potential investors.",
                    author: "Neil S., CEO",
                    company: "Nexus Startups",
                    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  },
                  {
                    quote: "The technology features keep me connected to my business even when I'm on the road between meetings.",
                    author: "Sophia K., Founder",
                    company: "Elevate Design Co.",
                    avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  }
                ].map((testimonial, index) => (
                  <BusinessTestimonial key={index} testimonial={testimonial} index={index} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Business appointment scheduling */}
      <section className="py-16 bg-[#263238] text-white">
        <div className="toyota-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-light mb-4">
                Schedule a Professional Consultation
              </h2>
              <div className="h-0.5 w-24 bg-[#90A4AE] mb-6"></div>
              
              <p className="text-gray-300 mb-6">
                Our business vehicle specialists understand the unique needs of professionals. Schedule a personalized consultation to discuss vehicle options that align with your career requirements and company policies.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  {
                    text: "Exclusive after-hours appointments available",
                    icon: <Clock className="h-5 w-5 text-[#90A4AE]" />
                  },
                  {
                    text: "Business-focused test drives on your daily routes",
                    icon: <Car className="h-5 w-5 text-[#90A4AE]" />
                  },
                  {
                    text: "Detailed analysis of ownership costs and benefits",
                    icon: <BookOpen className="h-5 w-5 text-[#90A4AE]" />
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="mr-3 flex-shrink-0">
                      {item.icon}
                    </div>
                    <p className="text-gray-300">{item.text}</p>
                  </div>
                ))}
              </div>
              
              <Button
                asChild
                className="rounded-none bg-white text-[#263238] hover:bg-gray-200"
              >
                <Link to="/business-appointment" className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Consultation
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Business Consultation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#90A4AE] p-4 text-white">
                <p className="text-sm font-medium">Toyota Business Advisors</p>
                <p className="text-xs opacity-80">Personalized service for professionals</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Business-styled vehicle card component
interface BusinessVehicleCardProps {
  vehicle: VehicleModel;
  index: number;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

const BusinessVehicleCard: React.FC<BusinessVehicleCardProps> = ({ vehicle, index, isFavorite, onFavoriteToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-300"
    >
      <div className="relative">
        <img 
          src={vehicle.image} 
          alt={vehicle.name}
          className="w-full h-48 object-cover" 
        />
        <button
          onClick={onFavoriteToggle}
          className="absolute top-3 right-3 bg-white p-2 hover:bg-gray-100 transition-colors"
        >
          <Heart 
            className="h-4 w-4" 
            fill={isFavorite ? "#263238" : "none"} 
            stroke={isFavorite ? "#263238" : "currentColor"} 
          />
        </button>
        <div className="absolute top-3 left-3">
          <span className="bg-[#263238] text-white text-xs py-1 px-2">
            {vehicle.category}
          </span>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
          <h3 className="text-lg font-medium text-[#263238]">{vehicle.name}</h3>
          <span className="text-xs text-gray-500">Latest Model</span>
        </div>
        
        <div className="mb-4">
          {vehicle.features.slice(0, 2).map((feature, i) => (
            <div key={i} className="flex items-center text-sm text-gray-600 mb-1">
              <span className="h-1 w-1 bg-[#90A4AE] mr-2" />
              {feature}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="text-lg font-medium text-[#263238]">
            ${vehicle.price.toLocaleString()}
          </span>
          <Button
            asChild
            size="sm"
            className="rounded-none bg-[#263238] hover:bg-[#1a252a] text-white"
          >
            <Link to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`}>
              Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </motion.div>
  );
};

// Business testimonial component
interface BusinessTestimonialProps {
  testimonial: {
    quote: string;
    author: string;
    company: string;
    avatar: string;
  };
  index: number;
}

const BusinessTestimonial: React.FC<BusinessTestimonialProps> = ({ testimonial, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
            <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-[#90A4AE] text-[#90A4AE]" />
            ))}
          </div>
          <p className="italic text-gray-600 mb-4 text-sm">"{testimonial.quote}"</p>
          <p className="font-medium text-[#263238]">{testimonial.author}</p>
          <p className="text-sm text-gray-500">{testimonial.company}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default BusinessCommuterHomepage;
