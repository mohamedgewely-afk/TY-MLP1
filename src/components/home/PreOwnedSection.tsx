
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PreOwnedVehicle } from "@/types/vehicle";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, RotateCw, TestTube, Mail, Phone, ShieldCheck, CalendarClock, CarFront } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PreOwnedSectionProps {
  vehicles: PreOwnedVehicle[];
}

const PreOwnedSection: React.FC<PreOwnedSectionProps> = ({ vehicles }) => {
  const [priceRange, setPriceRange] = useState<number[]>([50000, 200000]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  
  // Find min and max prices for the slider
  const minPrice = Math.min(...vehicles.map(v => v.price));
  const maxPrice = Math.max(...vehicles.map(v => v.price));
  
  // Filter vehicles by price range
  const filteredVehicles = vehicles.filter(
    vehicle => vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1]
  );

  // Toggle card flip state
  const toggleFlip = (id: string) => {
    setFlippedCards(prev => 
      prev.includes(id) 
        ? prev.filter(cardId => cardId !== id) 
        : [...prev, id]
    );
  };

  const cardVariants = {
    front: {
      rotateY: 0,
    },
    back: {
      rotateY: 180,
    },
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="toyota-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Toyota Certified Pre-Owned
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Quality pre-owned vehicles with Toyota certification and warranty.
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0" asChild>
            <a href="/pre-owned">
              View All Pre-Owned <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        {/* Price Range Filter */}
        <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Filter by Price Range</h3>
          <div className="px-4">
            <Slider
              defaultValue={priceRange}
              min={minPrice}
              max={maxPrice}
              step={5000}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>AED {priceRange[0].toLocaleString()}</span>
              <span>AED {priceRange[1].toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Showing {filteredVehicles.length} of {vehicles.length} vehicles
            </p>
          </div>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {filteredVehicles.map((vehicle) => (
              <CarouselItem key={vehicle.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                  className="h-full relative"
                >
                  <motion.div
                    className="h-full preserve-3d cursor-pointer"
                    initial="front"
                    animate={flippedCards.includes(vehicle.id) ? "back" : "front"}
                    variants={cardVariants}
                    transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
                    style={{ perspective: 1000 }}
                  >
                    {/* Front of card */}
                    <Card className={`h-full backface-hidden ${flippedCards.includes(vehicle.id) ? "opacity-0" : "opacity-100"}`}>
                      <div className="relative">
                        {vehicle.certified && (
                          <div className="absolute top-2 right-2 bg-toyota-red text-white text-xs py-1 px-2 rounded-full">
                            Certified
                          </div>
                        )}
                        <div className="w-full aspect-[4/3] bg-gray-100">
                          <img
                            src={vehicle.image}
                            alt={vehicle.model}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">{vehicle.model}</CardTitle>
                        <CardDescription className="flex justify-between items-center">
                          <span>{vehicle.year}</span>
                          <span className="text-toyota-red font-bold">
                            AED {vehicle.price.toLocaleString()}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="py-2 flex-grow">
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Mileage:</span>
                            <span>{vehicle.mileage.toLocaleString()} km</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{vehicle.description}</p>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-2 grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => toggleFlip(vehicle.id)}>
                          <RotateCw className="mr-1 h-4 w-4" /> View Details
                        </Button>
                        <Button size="sm" className="w-full bg-toyota-red hover:bg-toyota-darkred" asChild>
                          <a href={`/test-drive?model=${encodeURIComponent(vehicle.model)}&preowned=true&id=${vehicle.id}`}>
                            <TestTube className="mr-1 h-4 w-4" /> Test Drive
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>

                    {/* Back of card */}
                    <Card className={`h-full absolute inset-0 backface-hidden rotateY-180 ${flippedCards.includes(vehicle.id) ? "opacity-100" : "opacity-0"}`}>
                      <CardHeader>
                        <CardTitle className="text-xl">{vehicle.model} - {vehicle.year}</CardTitle>
                        <CardDescription className="text-toyota-red font-bold">
                          AED {vehicle.price.toLocaleString()}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex-grow">
                        <ul className="space-y-3 mb-4">
                          <li className="flex items-start">
                            <span className="inline-block bg-toyota-red/10 text-toyota-red rounded-full p-1 mr-2">
                              <CarFront className="h-3 w-3" />
                            </span>
                            <span>VIN: {vehicle.id.substring(0, 8).toUpperCase()}...</span>
                          </li>
                          <li className="flex items-start">
                            <span className="inline-block bg-toyota-red/10 text-toyota-red rounded-full p-1 mr-2">
                              <CalendarClock className="h-3 w-3" />
                            </span>
                            <span>Model Year: {vehicle.year}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="inline-block bg-toyota-red/10 text-toyota-red rounded-full p-1 mr-2">
                              <ShieldCheck className="h-3 w-3" />
                            </span>
                            <span>Warranty: {vehicle.certified ? "Toyota Certified" : "Limited"}</span>
                          </li>
                        </ul>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4">
                          <h4 className="font-medium text-sm mb-2">Reserve this vehicle today</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                            Secure this vehicle with a fully-refundable AED 5,000 deposit.
                          </p>
                          <Button className="w-full bg-toyota-red hover:bg-toyota-darkred" asChild>
                            <a href={`/reserve?id=${vehicle.id}`}>
                              Reserve Now
                            </a>
                          </Button>
                        </div>
                      </CardContent>

                      <CardFooter className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => toggleFlip(vehicle.id)}>
                          <RotateCw className="mr-1 h-4 w-4" /> Back
                        </Button>
                        <Button variant="secondary" size="sm" className="w-full" asChild>
                          <a href={`/enquire?model=${encodeURIComponent(vehicle.model)}&preowned=true&id=${vehicle.id}`}>
                            <Mail className="mr-1 h-4 w-4" /> Enquire
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1" />
          <CarouselNext className="right-1" />
        </Carousel>
      </div>
    </section>
  );
};

export default PreOwnedSection;
