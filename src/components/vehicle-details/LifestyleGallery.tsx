import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VehicleModel } from "@/types/vehicle";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface LifestyleGalleryProps {
  vehicle: VehicleModel;
}

const realLifestyleImages = [
  "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
  "https://images.pexels.com/photos/464439/pexels-photo-464439.jpeg",
  "https://images.pexels.com/photos/2179217/pexels-photo-2179217.jpeg",
  "https://images.pexels.com/photos/1619311/pexels-photo-1619311.jpeg",
  "https://images.pexels.com/photos/1394882/pexels-photo-1394882.jpeg",
  "https://images.pexels.com/photos/543726/pexels-photo-543726.jpeg"
];

const LifestyleGallery: React.FC<LifestyleGalleryProps> = ({ vehicle }) => {
  const lifestyleCards = [
    {
      title: "Family Adventures",
      description: "Spacious, comfortable, and built for the whole family - perfect for road trips, city outings and activities.",
      image: realLifestyleImages[0],
      link: `/lifestyle/family/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`,
    },
    {
      title: "Urban Exploration",
      description: "Navigate city streets and hotspots with style and efficiency.",
      image: realLifestyleImages[1],
      link: `/lifestyle/urban/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`,
    },
    {
      title: "Desert Escapes",
      description: "See the real UAE: Sand dunes, adventure, and unforgettable journeys with Toyota.",
      image: realLifestyleImages[2],
      link: `/lifestyle/desert/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`,
    },
    {
      title: "Weekend Getaways",
      description: "Your reliable companion for spontaneous trips, beach escapes, and mountain drives.",
      image: realLifestyleImages[3],
      link: `/lifestyle/weekend/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`,
    },
    {
      title: "Adventure Destinations",
      description: "Explore the outdoors with confidence, with every Toyota road trip.",
      image: realLifestyleImages[4],
      link: `/lifestyle/adventure/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`,
    },
    {
      title: "Business Travel",
      description: "Presence, prestige, and tech—all you need for those business commutes and more.",
      image: realLifestyleImages[5],
      link: `/lifestyle/business/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`,
    },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your {vehicle.name} Lifestyle
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover how the {vehicle.name} adapts perfectly to your lifestyle—across all adventures, family and work.
          </p>
        </motion.div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {lifestyleCards.map((card, index) => (
              <CarouselItem key={card.title} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full group">
                    <div className="h-60 overflow-hidden relative">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-lg font-semibold">
                        {card.title}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{card.description}</p>
                      <Button
                        variant="link"
                        className="p-0 text-toyota-red hover:text-toyota-darkred"
                        asChild
                      >
                        <a href={card.link} className="flex items-center">
                          Learn More <ArrowRight className="h-4 w-4 ml-1" />
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            asChild
            size="lg"
            className="bg-toyota-red hover:bg-toyota-darkred"
          >
            <a href="/lifestyle">Explore Toyota Lifestyle</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default LifestyleGallery;
