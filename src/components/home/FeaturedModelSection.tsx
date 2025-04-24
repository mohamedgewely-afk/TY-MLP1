
import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

const FeaturedModelSection = () => {
  const featuredModels = [
    {
      name: "All-New Crown Signia",
      tagline: "Luxury reimagined",
      description: "Introducing the first-ever Toyota Crown Signia, where premium comfort meets striking design.",
      image: "https://global.toyota/pages/news/images/2023/06/02/2000/20230602_01_14_s.jpg",
      badge: "New Arrival",
      link: "/vehicle/crown-signia"
    },
    {
      name: "GR Supra",
      tagline: "Born from racing",
      description: "Pure driving excitement with track-proven performance and iconic design heritage.",
      image: "https://global.toyota/pages/news/images/2023/01/12/001/20230112_01_gallery_05_w1920.jpg",
      badge: "Performance",
      link: "/vehicle/gr-supra"
    },
    {
      name: "bZ4X",
      tagline: "Electric adventure",
      description: "Venture beyond with Toyota's all-electric SUV, designed for sustainable exploration.",
      image: "https://global.toyota/pages/news/images/2021/10/29/001/20211029_01_gallery_03_w1920.jpg",
      badge: "All-Electric",
      link: "/vehicle/bz4x"
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="toyota-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white"
        >
          Featured Models
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12"
        >
          Experience the latest innovations and signature designs from Toyota's premium lineup
        </motion.p>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {featuredModels.map((model, index) => (
              <CarouselItem key={model.name} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  viewport={{ once: true }}
                  className="h-full"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                    <div className="relative">
                      <img 
                        src={model.image} 
                        alt={model.name}
                        className="w-full h-64 object-cover"
                      />
                      <Badge className="absolute top-4 right-4 bg-toyota-red font-medium">
                        {model.badge}
                      </Badge>
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{model.name}</h3>
                      <p className="text-toyota-red font-medium mb-3">{model.tagline}</p>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">{model.description}</p>
                      
                      <Button 
                        asChild 
                        className="mt-auto bg-toyota-red hover:bg-toyota-darkred w-full"
                      >
                        <Link to={model.link} className="flex items-center justify-center">
                          Discover <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedModelSection;
