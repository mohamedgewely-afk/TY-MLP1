
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

const LifestyleGallery: React.FC<LifestyleGalleryProps> = ({ vehicle }) => {
  const lifestyleCards = [
    {
      title: "Family Adventures",
      description: "Spacious, comfortable, and built for the whole family - perfect for road trips and daily adventures.",
      image: "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/corolla/corolla-comfort-thumb.jpg",
      link: `/lifestyle/family/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`,
    },
    {
      title: "Urban Exploration",
      description: "Navigate city streets with style and efficiency, finding new favorite spots in your Toyota.",
      image: "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/rav4/rav4-convenience-thumb.jpg",
      link: `/lifestyle/urban/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`,
    },
    {
      title: "Weekend Getaways",
      description: "Your reliable companion for spontaneous trips, designed to make every journey memorable.",
      image: "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/camry/camry-convenience-thumb.jpg",
      link: `/lifestyle/weekend/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`,
    },
    {
      title: "Adventure Destinations",
      description: "Explore the great outdoors with confidence, knowing your Toyota can handle any terrain.",
      image: "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/land-cruiser/lc300-convenience-thumb.jpg",
      link: `/lifestyle/adventure/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`,
    },
    {
      title: "Business Travel",
      description: "Make a statement with sophistication and reliability on your business commutes and travels.",
      image: "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/gr-supra/supra-convenience-thumb.jpg",
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
            Discover how the {vehicle.name} adapts perfectly to your lifestyle needs.
            From daily commutes to weekend adventures, it's designed to enhance every journey.
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
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                    <div className="h-60 overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
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
